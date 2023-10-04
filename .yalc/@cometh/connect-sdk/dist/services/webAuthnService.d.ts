import { StaticJsonRpcProvider } from '@ethersproject/providers';
import { API } from '../services';
import { DeviceData, WebAuthnSigner } from '../wallet';
import { ComethProvider } from '../wallet/ComethProvider';
declare const _default: {
    createCredential: (userName?: string | undefined) => Promise<{
        point: any;
        id: string;
    }>;
    sign: (challenge: BufferSource, publicKeyCredential: PublicKeyCredentialDescriptor[]) => Promise<any>;
    getWebAuthnSignature: (hash: string, publicKeyCredential: PublicKeyCredentialDescriptor[]) => Promise<{
        encodedSignature: string;
        publicKeyId: string;
    }>;
    waitWebAuthnSignerDeployment: (P256FactoryContractAddress: string, publicKey_X: string, publicKey_Y: string, provider: StaticJsonRpcProvider | ComethProvider) => Promise<string>;
    isWebAuthnCompatible: () => Promise<boolean>;
    createWebAuthnSigner: (API: API, userName?: string | undefined, userId?: string | undefined) => Promise<{
        publicKeyX: string;
        publicKeyY: string;
        publicKeyId: string;
        signerAddress: string;
        deviceData: DeviceData;
        walletAddress: string;
    }>;
    signWithWebAuthn: (webAuthnSigners: WebAuthnSigner[], challenge: string) => Promise<{
        encodedSignature: string;
        publicKeyId: string;
    }>;
    createSignerAndWallet: (API: API, userName?: string | undefined) => Promise<{
        publicKeyId: string;
        signerAddress: string;
    }>;
    createSignerAndWalletForUserId: (token: string, userId: string, API: API, userName?: string | undefined) => Promise<{
        publicKeyId: string;
        signerAddress: string;
    }>;
    getSigner: (API: API, walletAddress: string) => Promise<{
        publicKeyId: string;
        signerAddress: string;
    }>;
    getSignerForUserId: (walletAddress: string, userId: string, API: API) => Promise<{
        publicKeyId: string;
        signerAddress: string;
    }>;
};
export default _default;
