import { JsonRpcSigner } from '@ethersproject/providers';
import { Wallet } from 'ethers';
import { API } from '../services';
export declare class IConnectionSigning {
    readonly chainId: string;
    protected API: API;
    constructor(chainId: string, apiKey: string, baseUrl?: string);
    signAndConnect(walletAddress: string, signer: JsonRpcSigner | Wallet): Promise<void>;
    private signMessage;
}
