export declare const API_URL = "https://api.connect.cometh.io/";
export declare const DEFAULT_CHAIN_ID = 137;
export declare const DEFAULT_RPC_TARGET = "https://polygon-rpc.com";
export declare const networks: {
    137: {
        RPCUrl: string;
        networkName: string;
    };
    80001: {
        RPCUrl: string;
        networkName: string;
    };
    43114: {
        RPCUrl: string;
        networkName: string;
    };
    43113: {
        RPCUrl: string;
        networkName: string;
    };
    100: {
        RPCUrl: string;
        networkName: string;
    };
    10200: {
        RPCUrl: string;
        networkName: string;
    };
};
export declare const GAS_GAP_TOLERANCE = 10;
export declare const DEFAULT_BASE_GAS = 80000;
export declare const DEFAULT_REWARD_PERCENTILE = 80;
export declare const BLOCK_EVENT_GAP = -500;
export declare const EIP712_SAFE_MESSAGE_TYPE: {
    SafeMessage: {
        type: string;
        name: string;
    }[];
};
export declare const EIP712_SAFE_TX_TYPES: {
    SafeTx: {
        type: string;
        name: string;
    }[];
};
export declare const challengePrefix = "226368616c6c656e6765223a";
export declare const Pbkdf2Iterations: number;
export declare const ADD_OWNER_FUNCTION_SELECTOR = "0x0d582f13";
