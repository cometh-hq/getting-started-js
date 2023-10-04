import { Provider, TransactionRequest, TransactionResponse } from '@ethersproject/abstract-provider';
import { Signer } from '@ethersproject/abstract-signer';
import { Bytes } from 'ethers';
import { Deferrable } from 'ethers/lib/utils';
import { ComethProvider } from './ComethProvider';
import { ComethWallet } from './ComethWallet';
export declare class ComethSigner extends Signer {
    private wallet;
    constructor(wallet: ComethWallet, provider: ComethProvider);
    getAddress(): Promise<string>;
    signMessage(message: string | Bytes): Promise<string>;
    sendTransaction(transaction: Deferrable<TransactionRequest>): Promise<TransactionResponse>;
    signTransaction(transaction: Deferrable<TransactionRequest>): Promise<string>;
    connect(provider: Provider): Signer;
}
