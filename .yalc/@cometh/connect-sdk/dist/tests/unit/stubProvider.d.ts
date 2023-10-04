import { JsonRpcProvider } from '@ethersproject/providers';
import { BigNumber } from 'ethers';
declare class StubProvider extends JsonRpcProvider {
    estimateGas(): Promise<BigNumber>;
    send(): Promise<any>;
    getBalance(): Promise<BigNumber>;
}
export default StubProvider;
