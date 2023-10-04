import { Wallet } from 'ethers';
import { WebAuthnSigner } from '../signers/WebAuthnSigner';
import { NewSignerRequest, NewSignerRequestBody, SupportedNetworks, UserInfos } from '../types';
import { AUTHAdapter } from './types';
export interface ConnectWithJwtAdaptorConfig {
    chainId: SupportedNetworks;
    jwtToken: string;
    apiKey: string;
    userName?: string;
    rpcUrl?: string;
    baseUrl?: string;
}
export declare class ConnectWithJwtAdaptor implements AUTHAdapter {
    private signer?;
    readonly chainId: SupportedNetworks;
    private API;
    private jwtToken;
    private provider;
    private userName?;
    constructor({ chainId, jwtToken, apiKey, userName, rpcUrl, baseUrl }: ConnectWithJwtAdaptorConfig);
    connect(): Promise<void>;
    logout(): Promise<void>;
    getAccount(): Promise<string>;
    getSigner(): Wallet | WebAuthnSigner;
    getWalletAddress(): Promise<string>;
    getUserInfos(): Promise<Partial<UserInfos>>;
    initNewSignerRequest(walletAddress: string, userName?: string): Promise<NewSignerRequestBody>;
    createNewSignerRequest(userName?: string): Promise<void>;
    getNewSignerRequests(): Promise<NewSignerRequest[] | null>;
    deleteNewSignerRequest(signerAddress: string): Promise<void>;
    deployWebAuthnSigner(newSignerRequest: NewSignerRequest): Promise<string>;
}
