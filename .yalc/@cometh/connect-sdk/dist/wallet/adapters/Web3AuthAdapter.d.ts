import { JsonRpcSigner } from '@ethersproject/providers';
import { Web3AuthCoreOptions } from '@web3auth/core';
import { IConnectionSigning } from '../IConnectionSigning';
import { SupportedNetworks, UserInfos } from '../types';
import { AUTHAdapter } from './types';
export declare class Web3AuthAdapter extends IConnectionSigning implements AUTHAdapter {
    private web3auth;
    private ethProvider;
    private web3authConfig;
    constructor(web3authConfig: Web3AuthCoreOptions, chainId: SupportedNetworks, apiKey: string, baseUrl?: string);
    connect(): Promise<void>;
    logout(): Promise<void>;
    getAccount(): Promise<string | null>;
    getSigner(): JsonRpcSigner;
    getWalletAddress(): Promise<string>;
    getUserInfos(): Promise<Partial<UserInfos>>;
}
