import { StaticJsonRpcProvider } from '@ethersproject/providers';
import { ethers, Wallet } from 'ethers';
import { API } from './API';
export declare const createSignerAndWallet: (API: API) => Promise<Wallet>;
export declare const createSignerAndWalletForUserId: (token: string, userId: string, API: API) => Promise<Wallet>;
export declare const getSigner: (API: API, provider: StaticJsonRpcProvider, walletAddress: string) => Promise<Wallet>;
export declare const getSignerForUserId: (userId: string, API: API, provider: StaticJsonRpcProvider, walletAddress: string) => Promise<Wallet>;
declare const _default: {
    createSignerAndWallet: (API: API) => Promise<ethers.Wallet>;
    createSignerAndWalletForUserId: (token: string, userId: string, API: API) => Promise<ethers.Wallet>;
    getSigner: (API: API, provider: StaticJsonRpcProvider, walletAddress: string) => Promise<ethers.Wallet>;
    getSignerForUserId: (userId: string, API: API, provider: StaticJsonRpcProvider, walletAddress: string) => Promise<ethers.Wallet>;
};
export default _default;
