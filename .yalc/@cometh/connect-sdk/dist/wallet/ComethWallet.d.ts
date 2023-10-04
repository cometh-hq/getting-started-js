import { StaticJsonRpcProvider } from '@ethersproject/providers';
import { BigNumber, Bytes } from 'ethers';
import { AUTHAdapter } from './adapters';
import { MetaTransactionData, SafeTransactionDataPartial, SendTransactionResponse, UIConfig, WalletInfos } from './types';
export interface WalletConfig {
    authAdapter: AUTHAdapter;
    apiKey: string;
    rpcUrl?: string;
    uiConfig?: UIConfig;
    baseUrl?: string;
}
export declare class ComethWallet {
    authAdapter: AUTHAdapter;
    readonly chainId: number;
    private connected;
    private BASE_GAS;
    private REWARD_PERCENTILE;
    private API;
    private provider;
    private sponsoredAddresses?;
    private walletAddress?;
    private signer?;
    private projectParams?;
    private uiConfig;
    constructor({ authAdapter, apiKey, rpcUrl, baseUrl }: WalletConfig);
    /**
     * Connection Section
     */
    connect(walletAddress?: string): Promise<void>;
    getConnected(): boolean;
    getProvider(): StaticJsonRpcProvider;
    getUserInfos(): Promise<WalletInfos>;
    getAddress(): string;
    logout(): Promise<void>;
    addOwner(newOwner: string): Promise<SendTransactionResponse>;
    getOwners(): Promise<string[]>;
    /**
     * Signing Message Section
     */
    signMessage(messageToSign: string | Bytes): Promise<string>;
    signTransaction(safeTxData: SafeTransactionDataPartial): Promise<string>;
    private _isSponsoredTransaction;
    _signAndSendTransaction(safeTxDataTyped: SafeTransactionDataPartial): Promise<string>;
    sendTransaction(safeTxData: MetaTransactionData): Promise<SendTransactionResponse>;
    sendBatchTransactions(safeTxData: MetaTransactionData[]): Promise<SendTransactionResponse>;
    displayModal(safeTxGas: BigNumber, gasPrice: BigNumber): Promise<void>;
    _prepareTransaction(to: string, value: string, data: string, operation?: number): Promise<SafeTransactionDataPartial>;
}
