import { getEntryPointVersion } from "permissionless"
import type { SmartAccount } from "permissionless/accounts"
import type { Middleware } from "permissionless/actions/smartAccount"
import type { EntryPoint, Prettify } from "permissionless/types"
import type { BundlerRpcSchema } from "permissionless/types/bundler"
import {
    http,
    type Chain,
    type Client,
    type ClientConfig,
    type Transport,
    createClient
} from "viem"
import type { KernelSmartAccount } from "../accounts/index.js"
import { getUserOperationGasPrice } from "../actions/account-client/getUserOperationGasPrice.js"
import {
    type KernelAccountClientActions,
    kernelAccountClientActions
} from "./decorators/kernel.js"
import { isProviderSet, setPimlicoAsProvider } from "./utils.js"

export type KernelAccountClient<
    entryPoint extends EntryPoint,
    transport extends Transport = Transport,
    chain extends Chain | undefined = Chain | undefined,
    account extends
        | KernelSmartAccount<entryPoint, transport, chain>
        | undefined =
        | KernelSmartAccount<entryPoint, transport, chain>
        | undefined
> = Client<
    transport,
    chain,
    account,
    BundlerRpcSchema<entryPoint>,
    KernelAccountClientActions<entryPoint, transport, chain, account>
>

export type SmartAccountClientConfig<
    entryPoint extends EntryPoint,
    transport extends Transport = Transport,
    chain extends Chain | undefined = Chain | undefined,
    account extends
        | SmartAccount<entryPoint, string, transport, chain>
        | undefined =
        | SmartAccount<entryPoint, string, transport, chain>
        | undefined
> = Prettify<
    Pick<
        ClientConfig<transport, chain, account>,
        "cacheTime" | "chain" | "key" | "name" | "pollingInterval"
    > & {
        account?: account
        bundlerTransport: Transport
    } & Middleware<entryPoint> & {
            entryPoint: entryPoint
        }
>

export const createKernelAccountClient = <
    TTransport extends Transport,
    TChain extends Chain | undefined,
    TEntryPoint extends EntryPoint,
    TSmartAccount extends
        | KernelSmartAccount<TEntryPoint, TTransport, TChain>
        | undefined =
        | KernelSmartAccount<TEntryPoint, TTransport, TChain>
        | undefined
>(
    parameters: SmartAccountClientConfig<
        TEntryPoint,
        TTransport,
        TChain,
        TSmartAccount
    >
): KernelAccountClient<TEntryPoint, TTransport, TChain, TSmartAccount> => {
    const {
        key = "Account",
        name = "Kernel Account Client",
        bundlerTransport,
        entryPoint
    } = parameters
    const entryPointVersion = getEntryPointVersion(entryPoint)
    const shouldIncludePimlicoProvider =
        bundlerTransport({}).config.key === "http" &&
        entryPointVersion === "v0.7"

    const client = createClient({
        ...parameters,
        key,
        name,
        transport: (opts) => {
            let _bundlerTransport = bundlerTransport({
                ...opts,
                retryCount: 0
            })
            if (
                !shouldIncludePimlicoProvider ||
                isProviderSet(_bundlerTransport.value?.url, "ALCHEMY") ||
                isProviderSet(_bundlerTransport.value?.url, "ZERODEV")
            )
                return _bundlerTransport
            _bundlerTransport = http(
                setPimlicoAsProvider(_bundlerTransport.value?.url)
            )({ ...opts, retryCount: 0 })
            return _bundlerTransport
        },
        type: "kernelAccountClient"
    })

    let middleware = parameters.middleware
    const providers = ["PIMLICO", "THIRDWEB"]

    for (const provider of providers) {
        if (
            (!middleware ||
                (typeof middleware !== "function" && !middleware.gasPrice)) &&
            client.transport?.url &&
            isProviderSet(client.transport.url, provider)
        ) {
            const gasPrice = () => getUserOperationGasPrice(client, provider)
            middleware = {
                ...middleware,
                gasPrice
            }
            break
        }
    }
    return client.extend(
        kernelAccountClientActions({
            middleware
        })
    ) as KernelAccountClient<TEntryPoint, TTransport, TChain, TSmartAccount>
}
