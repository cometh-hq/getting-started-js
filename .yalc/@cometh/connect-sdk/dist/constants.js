"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ADD_OWNER_FUNCTION_SELECTOR = exports.Pbkdf2Iterations = exports.challengePrefix = exports.EIP712_SAFE_TX_TYPES = exports.EIP712_SAFE_MESSAGE_TYPE = exports.BLOCK_EVENT_GAP = exports.DEFAULT_REWARD_PERCENTILE = exports.DEFAULT_BASE_GAS = exports.GAS_GAP_TOLERANCE = exports.networks = exports.DEFAULT_RPC_TARGET = exports.DEFAULT_CHAIN_ID = exports.API_URL = void 0;
exports.API_URL = 'https://api.connect.cometh.io/';
exports.DEFAULT_CHAIN_ID = 137;
exports.DEFAULT_RPC_TARGET = 'https://polygon-rpc.com';
exports.networks = {
    // Default network: Polygon
    137: {
        RPCUrl: process.env.RPC_URL_POLYGON || 'https://polygon-rpc.com',
        networkName: 'Polygon'
    },
    80001: {
        RPCUrl: process.env.RPC_URL_MUMBAI || 'https://rpc-mumbai.maticvigil.com',
        networkName: 'Mumbai'
    },
    43114: {
        RPCUrl: process.env.RPC_URL_AVALANCHE ||
            'https://avalanche-mainnet.infura.io/v3/5eba3fe58b4646c89a0e3fad285769d4',
        networkName: 'Avalanche'
    },
    43113: {
        RPCUrl: process.env.RPC_URL_FUJI ||
            'https://avalanche-fuji.infura.io/v3/5eba3fe58b4646c89a0e3fad285769d4',
        networkName: 'Fuji'
    },
    100: {
        RPCUrl: process.env.RPC_URL_GNOSIS || 'https://rpc.ankr.com/gnosis',
        networkName: 'Gnosis Chain'
    },
    10200: {
        RPCUrl: process.env.RPC_URL_CHIADO || 'https://rpc.chiadochain.net',
        networkName: 'Chiado Chain'
    }
};
exports.GAS_GAP_TOLERANCE = 10;
exports.DEFAULT_BASE_GAS = 80000;
exports.DEFAULT_REWARD_PERCENTILE = 80;
exports.BLOCK_EVENT_GAP = -500;
exports.EIP712_SAFE_MESSAGE_TYPE = {
    // "SafeMessage(bytes message)"
    SafeMessage: [{ type: 'bytes', name: 'message' }]
};
exports.EIP712_SAFE_TX_TYPES = {
    SafeTx: [
        { type: 'address', name: 'to' },
        { type: 'uint256', name: 'value' },
        { type: 'bytes', name: 'data' },
        { type: 'uint8', name: 'operation' },
        { type: 'uint256', name: 'safeTxGas' },
        { type: 'uint256', name: 'baseGas' },
        { type: 'uint256', name: 'gasPrice' },
        { type: 'address', name: 'gasToken' },
        { type: 'address', name: 'refundReceiver' },
        { type: 'uint256', name: 'nonce' }
    ]
};
exports.challengePrefix = '226368616c6c656e6765223a';
exports.Pbkdf2Iterations = Number(process.env.PBKDF2_ITERATIONS) || 1000000;
exports.ADD_OWNER_FUNCTION_SELECTOR = '0x0d582f13';
