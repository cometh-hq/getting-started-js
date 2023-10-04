import { StaticJsonRpcProvider } from '@ethersproject/providers';
import { ComethProvider } from '../wallet/ComethProvider';
import { MetaTransactionData, SafeTransactionDataPartial } from '../wallet/types';
import { API } from './API';
declare const _default: {
    isDeployed: (walletAddress: string, provider: StaticJsonRpcProvider | ComethProvider) => Promise<boolean>;
    getNonce: (walletAddress: string, provider: StaticJsonRpcProvider | ComethProvider) => Promise<number>;
    getSuccessExecTransactionEvent: (safeTxHash: string, walletAddress: string, provider: StaticJsonRpcProvider | ComethProvider) => Promise<any>;
    getFailedExecTransactionEvent: (safeTxHash: string, walletAddress: string, provider: StaticJsonRpcProvider | ComethProvider) => Promise<any>;
    isSafeOwner: (walletAddress: string, signerAddress: string, provider: StaticJsonRpcProvider) => Promise<boolean>;
    getOwners: (walletAddress: string, provider: StaticJsonRpcProvider) => Promise<string[]>;
    prepareAddOwnerTx: (walletAddress: string, newOwner: string) => Promise<MetaTransactionData>;
    formatWebAuthnSignatureForSafe: (signerAddress: string, signature: string) => string;
    getSafeTransactionHash: (walletAddress: string, transactionData: SafeTransactionDataPartial, chainId: number) => string;
    getTransactionsTotalValue: (safeTxData: MetaTransactionData[]) => Promise<string>;
    isSigner: (signerAddress: string, walletAddress: string, provider: StaticJsonRpcProvider, API: API) => Promise<boolean>;
    getFunctionSelector: (transactionData: MetaTransactionData) => string;
};
export default _default;
