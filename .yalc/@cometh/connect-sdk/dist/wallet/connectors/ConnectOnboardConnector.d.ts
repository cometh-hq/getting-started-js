import { WalletInit } from '@web3-onboard/common';
import { AUTHAdapter } from '../adapters';
import { WalletUiConfig } from '../types';
export declare function ConnectOnboardConnector({ apiKey, authAdapter, rpcUrl, baseUrl, uiConfig }: {
    apiKey: string;
    authAdapter: AUTHAdapter;
    rpcUrl?: string;
    baseUrl?: string;
    uiConfig?: WalletUiConfig;
}): WalletInit;
