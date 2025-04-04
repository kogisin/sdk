import type { Abi, Address, Hex } from "viem"
import type { UserOperation } from "viem/account-abstraction"
import type { PolicyFlags } from "../constants.js"
import type { Permission } from "../types.js"

export type PolicyParams = {
    policyAddress?: Address
    policyFlag?: PolicyFlags
}

export type SudoPolicyParams = PolicyParams

export type SignaturePolicyParams = PolicyParams & {
    allowedRequestors: Address[]
}

export type MerklePolicyParams<
    TAbi extends Abi | readonly unknown[],
    TFunctionName extends string | undefined = string
> = PolicyParams & {
    permissions?: Permission<TAbi, TFunctionName>[]
}

export type GasPolicyParams = PolicyParams & {
    maxGasAllowedInWei: bigint
    enforcePaymaster?: boolean
    paymasterAddress?: Address
}

export type Policy = {
    getPolicyData: () => Hex
    getSignaturePolicyData: (userOperation: UserOperation) => Hex
    getPolicyInfoInBytes: () => Hex
    // return params directly to serialize/deserialize Policy
    policyParams:
        | (SudoPolicyParams & { type: "sudo" })
        | (SignaturePolicyParams & { type: "signature" })
        | (MerklePolicyParams<Abi | readonly unknown[], string> & {
              type: "merkle"
          })
        | (GasPolicyParams & { type: "gas" })
}
