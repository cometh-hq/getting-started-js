import { JsonRpcSigner } from '@ethersproject/providers';
import { MagicSDKAdditionalConfiguration } from 'magic-sdk';
import { IConnectionSigning } from '../IConnectionSigning';
import { UserInfos } from '../types';
import { AUTHAdapter } from './types';
export interface MagicLinkAdapterConfig {
    apiKey: string;
    options: MagicSDKAdditionalConfiguration & {
        chainId: string;
    };
}
export declare class MagicLinkAdapter extends IConnectionSigning implements AUTHAdapter {
    private magic;
    private ethProvider;
    private magicConfig;
    constructor(magicConfig: MagicLinkAdapterConfig, apiKey: string, baseUrl?: string);
    connect(): Promise<void>;
    logout(): Promise<void>;
    getAccount(): Promise<string | null>;
    getWalletAddress(): Promise<string>;
    getSigner(): JsonRpcSigner;
    getUserInfos(): Promise<Partial<UserInfos>>;
}
