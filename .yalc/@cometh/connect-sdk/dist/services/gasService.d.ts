import { StaticJsonRpcProvider } from '@ethersproject/providers';
import { BigNumber } from 'ethers';
import { MetaTransactionData } from '../wallet/types';
declare const _default: {
    getGasPrice: (provider: StaticJsonRpcProvider, rewardPercentile: number) => Promise<BigNumber>;
    estimateSafeTxGas: (walletAddress: string, safeTransactionData: MetaTransactionData[], provider: StaticJsonRpcProvider) => Promise<BigNumber>;
    getTotalCost: (safeTxGas: BigNumber, baseGas: number, gasPrice: BigNumber) => Promise<BigNumber>;
    verifyHasEnoughBalance: (provider: StaticJsonRpcProvider, walletAddress: string, safeTxGas: BigNumber, gasPrice: BigNumber, baseGas: number, txValue: string) => Promise<void>;
};
export default _default;
