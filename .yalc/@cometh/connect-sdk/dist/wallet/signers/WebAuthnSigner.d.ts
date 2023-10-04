import { Provider } from '@ethersproject/abstract-provider';
import { Signer, TypedDataDomain, TypedDataField } from '@ethersproject/abstract-signer';
import { Bytes } from 'ethers';
import { SafeTransactionDataPartial } from '../types';
export declare class WebAuthnSigner extends Signer {
    private publicKeyId;
    private signerAddress;
    constructor(publicKeyId: string, signerAddress: string);
    getAddress(): Promise<string>;
    _signTypedData(domain: TypedDataDomain, types: Record<string, Array<TypedDataField>>, value: Record<string, any>): Promise<string>;
    signTransaction(safeTxDataTyped: SafeTransactionDataPartial): Promise<string>;
    signMessage(messageToSign: string | Bytes): Promise<string>;
    connect(provider: Provider): Signer;
}
