export const MultiTenantSessionAccountAbi = [
    {
        type: "constructor",
        inputs: [
            {
                name: "_ep",
                type: "address",
                internalType: "contract IEntryPoint"
            },
            {
                name: "_dm",
                type: "address",
                internalType: "contract IDelegationManager"
            }
        ],
        stateMutability: "nonpayable"
    },
    {
        type: "function",
        name: "dm",
        inputs: [],
        outputs: [
            {
                name: "",
                type: "address",
                internalType: "contract IDelegationManager"
            }
        ],
        stateMutability: "view"
    },
    {
        type: "function",
        name: "ep",
        inputs: [],
        outputs: [
            {
                name: "",
                type: "address",
                internalType: "contract IEntryPoint"
            }
        ],
        stateMutability: "view"
    },
    {
        type: "function",
        name: "executeUserOp",
        inputs: [
            {
                name: "userOp",
                type: "tuple",
                internalType: "struct PackedUserOperation",
                components: [
                    {
                        name: "sender",
                        type: "address",
                        internalType: "address"
                    },
                    { name: "nonce", type: "uint256", internalType: "uint256" },
                    { name: "initCode", type: "bytes", internalType: "bytes" },
                    { name: "callData", type: "bytes", internalType: "bytes" },
                    {
                        name: "accountGasLimits",
                        type: "bytes32",
                        internalType: "bytes32"
                    },
                    {
                        name: "preVerificationGas",
                        type: "uint256",
                        internalType: "uint256"
                    },
                    {
                        name: "gasFees",
                        type: "bytes32",
                        internalType: "bytes32"
                    },
                    {
                        name: "paymasterAndData",
                        type: "bytes",
                        internalType: "bytes"
                    },
                    { name: "signature", type: "bytes", internalType: "bytes" }
                ]
            },
            { name: "userOpHash", type: "bytes32", internalType: "bytes32" }
        ],
        outputs: [],
        stateMutability: "nonpayable"
    },
    {
        type: "function",
        name: "validateUserOp",
        inputs: [
            {
                name: "userOp",
                type: "tuple",
                internalType: "struct PackedUserOperation",
                components: [
                    {
                        name: "sender",
                        type: "address",
                        internalType: "address"
                    },
                    { name: "nonce", type: "uint256", internalType: "uint256" },
                    { name: "initCode", type: "bytes", internalType: "bytes" },
                    { name: "callData", type: "bytes", internalType: "bytes" },
                    {
                        name: "accountGasLimits",
                        type: "bytes32",
                        internalType: "bytes32"
                    },
                    {
                        name: "preVerificationGas",
                        type: "uint256",
                        internalType: "uint256"
                    },
                    {
                        name: "gasFees",
                        type: "bytes32",
                        internalType: "bytes32"
                    },
                    {
                        name: "paymasterAndData",
                        type: "bytes",
                        internalType: "bytes"
                    },
                    { name: "signature", type: "bytes", internalType: "bytes" }
                ]
            },
            { name: "userOpHash", type: "bytes32", internalType: "bytes32" },
            {
                name: "missingAccountFunds",
                type: "uint256",
                internalType: "uint256"
            }
        ],
        outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
        stateMutability: "nonpayable"
    },
    {
        type: "error",
        name: "ActionFailed",
        inputs: [
            { name: "i", type: "uint256", internalType: "uint256" },
            { name: "reason", type: "bytes", internalType: "bytes" }
        ]
    },
    { type: "error", name: "WrongDelegate", inputs: [] },
    { type: "error", name: "WrongDelegator", inputs: [] }
] as const
