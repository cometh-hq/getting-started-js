import { BaseProvider, Network, TransactionReceipt, TransactionResponse } from '@ethersproject/providers';
import { ComethSigner } from './ComethSigner';
import { ComethWallet } from './ComethWallet';
export declare class ComethProvider extends BaseProvider {
    private wallet;
    readonly signer: ComethSigner;
    constructor(wallet: ComethWallet);
    getSigner(): ComethSigner;
    perform(method: string, params: any): Promise<any>;
    send(method: string, params: any): Promise<any>;
    getTransaction(safeTxHash: string): Promise<TransactionResponse>;
    getTransactionReceipt(transactionHash: string | Promise<string>): Promise<TransactionReceipt>;
    waitForTransaction(transactionHash: string, confirmations?: number, timeout?: number): Promise<TransactionReceipt>;
    detectNetwork(): Promise<Network>;
    eth_accounts(): string[];
}
