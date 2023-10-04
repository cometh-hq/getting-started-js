import { SiweMessage } from 'siwe';
import { DeviceData, NewSignerRequest, NewSignerRequestType, RelayTransactionType, SponsoredTransaction, UserNonceType, WalletInfos, WebAuthnSigner } from '../wallet/types';
export declare class API {
    private readonly api;
    constructor(apiKey: string, chainId: number, baseUrl?: string);
    getProjectParams(): Promise<{
        chainId: string;
        P256FactoryContractAddress: string;
        multisendContractAddress: string;
    }>;
    getNonce(walletAddress: string): Promise<UserNonceType>;
    getWalletAddress(ownerAddress: string): Promise<string>;
    getWalletInfos(walletAddress: string): Promise<WalletInfos | null>;
    getSponsoredAddresses(): Promise<SponsoredTransaction[]>;
    connect({ message, signature, walletAddress }: {
        message: SiweMessage;
        signature: string;
        walletAddress: string;
    }): Promise<string>;
    relayTransaction({ walletAddress, safeTxData, signatures }: RelayTransactionType): Promise<string>;
    initWallet({ ownerAddress }: {
        ownerAddress: string;
    }): Promise<string>;
    initWalletWithWebAuthn({ walletAddress, publicKeyId, publicKeyX, publicKeyY, deviceData }: {
        walletAddress: string;
        publicKeyId: string;
        publicKeyX: string;
        publicKeyY: string;
        deviceData: DeviceData;
    }): Promise<void>;
    /**
     * User Section
     */
    initWalletForUserID({ token, ownerAddress }: {
        token: string;
        ownerAddress: string;
    }): Promise<string>;
    initWalletWithWebAuthnForUserID({ token, walletAddress, publicKeyId, publicKeyX, publicKeyY, deviceData }: {
        token: string;
        walletAddress: string;
        publicKeyId: string;
        publicKeyX: string;
        publicKeyY: string;
        deviceData: DeviceData;
    }): Promise<void>;
    getWalletAddressFromUserID(token: string): Promise<string>;
    createNewSignerRequest({ token, walletAddress, signerAddress, deviceData, type, publicKeyX, publicKeyY, publicKeyId }: {
        token: string;
        walletAddress: string;
        signerAddress: string;
        deviceData: DeviceData;
        type: NewSignerRequestType;
        publicKeyId?: string;
        publicKeyX?: string;
        publicKeyY?: string;
    }): Promise<void>;
    deleteNewSignerRequest({ token, signerAddress }: {
        token: string;
        signerAddress: string;
    }): Promise<void>;
    /**
     * WebAuthn Section
     */
    predictWebAuthnSignerAddress({ publicKeyX, publicKeyY }: {
        publicKeyX: string;
        publicKeyY: string;
    }): Promise<string>;
    deployWebAuthnSigner({ token, walletAddress, publicKeyId, publicKeyX, publicKeyY, deviceData }: {
        token: string;
        walletAddress: string;
        publicKeyId: string;
        publicKeyX: string;
        publicKeyY: string;
        deviceData: DeviceData;
    }): Promise<string>;
    getWebAuthnSignerByPublicKeyId(publicKeyId: string): Promise<WebAuthnSigner>;
    getWebAuthnSignersByWalletAddress(walletAddress: string): Promise<WebAuthnSigner[]>;
    /**
     * New signer request
     */
    getNewSignerRequests(walletAddress: string): Promise<NewSignerRequest[] | null>;
}
