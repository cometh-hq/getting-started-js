import { Wallet } from 'ethers';
import { WebAuthnSigner } from '../signers/WebAuthnSigner';
import { NewSignerRequest, NewSignerRequestBody, SupportedNetworks, UserInfos } from '../types';
import { AUTHAdapter } from './types';
export interface ConnectAdaptorConfig {
    chainId: SupportedNetworks;
    apiKey: string;
    userName?: string;
    rpcUrl?: string;
    baseUrl?: string;
}
export declare class ConnectAdaptor implements AUTHAdapter {
    private signer?;
    readonly chainId: SupportedNetworks;
    private API;
    private provider;
    private walletAddress?;
    private userName?;
    private projectParams?;
    constructor({ chainId, apiKey, userName, rpcUrl, baseUrl }: ConnectAdaptorConfig);
    connect(walletAddress?: string): Promise<void>;
    _verifywalletAddress(walletAddress: string): Promise<void>;
    _initAdaptorWalletAddress(walletAddress?: string): Promise<string>;
    logout(): Promise<void>;
    getAccount(): Promise<string>;
    getSigner(): Wallet | WebAuthnSigner;
    getWalletAddress(): Promise<string>;
    getUserInfos(): Promise<Partial<UserInfos>>;
    initNewSignerRequest(walletAddress: string, userName?: string): Promise<NewSignerRequestBody>;
    getNewSignerRequests(): Promise<NewSignerRequest[] | null>;
    waitWebAuthnSignerDeployment(publicKey_X: string, publicKey_Y: string): Promise<void>;
}
