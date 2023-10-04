import { Wallet } from 'ethers';
import { IConnectionSigning } from '../IConnectionSigning';
import { SupportedNetworks, UserInfos } from '../types';
import { AUTHAdapter } from './types';
export declare class BurnerWalletAdaptor extends IConnectionSigning implements AUTHAdapter {
    private wallet?;
    constructor(chainId: SupportedNetworks, apiKey: string, baseUrl?: string);
    connect(): Promise<void>;
    logout(): Promise<void>;
    getAccount(): Promise<string>;
    getWalletAddress(): Promise<string>;
    getSigner(): Wallet;
    getUserInfos(): Promise<Partial<UserInfos>>;
}
