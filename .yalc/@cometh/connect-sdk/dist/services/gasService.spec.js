"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GAS_GAP_TOLERANCE = 20;
jest.doMock('../constants', () => ({
    GAS_GAP_TOLERANCE
}));
const ethers_1 = require("ethers");
const stubProvider_1 = __importDefault(require("../tests/unit/stubProvider"));
const gasService_1 = __importDefault(require("./gasService"));
const WALLET_ADDRESS = '0xecf9D83633dC1DE88400945c0f97B76153a386ec';
const EOA_ADDRESS = '0x4B758d3Af4c8B2662bC485420077413DDdd62E33';
jest.mock('@ethersproject/providers');
jest.mock('../ui/GasModal');
describe('gasService', () => {
    const reward = ethers_1.BigNumber.from(10);
    const baseFeePerGas = ethers_1.BigNumber.from(100);
    const mockedEstimateGas = ethers_1.BigNumber.from(123);
    describe('estimateSafeTxGas', () => {
        const transactionData = {
            to: EOA_ADDRESS,
            value: '1',
            data: '0x',
            operation: '0',
            safeTxGas: '0',
            baseGas: '0',
            gasPrice: '0',
            gasToken: ethers_1.ethers.constants.AddressZero,
            refundReceiver: ethers_1.ethers.constants.AddressZero,
            nonce: '0x_nonce',
            signatures: '0x_signature'
        };
        it('Given a single call transaction, when predicting the safeTxGas, then call estimateGas with the correct parameters', () => __awaiter(void 0, void 0, void 0, function* () {
            const provider = new stubProvider_1.default();
            const estimateGas = jest.spyOn(provider, 'estimateGas');
            yield gasService_1.default.estimateSafeTxGas(WALLET_ADDRESS, [transactionData], provider);
            expect(estimateGas).toHaveBeenCalledWith({
                baseGas: '0',
                data: '0x',
                from: WALLET_ADDRESS,
                gasPrice: '0',
                gasToken: '0x0000000000000000000000000000000000000000',
                nonce: '0x_nonce',
                operation: '0',
                refundReceiver: '0x0000000000000000000000000000000000000000',
                safeTxGas: '0',
                signatures: '0x_signature',
                to: EOA_ADDRESS,
                value: '1'
            });
        }));
        it('Given a single call transaction, when predicting the safeTxGas, then return the correct value', () => __awaiter(void 0, void 0, void 0, function* () {
            const safeTxGas = yield gasService_1.default.estimateSafeTxGas(WALLET_ADDRESS, [transactionData], new stubProvider_1.default());
            expect(safeTxGas).toEqual(mockedEstimateGas);
        }));
        it('Given a multisend transaction, when predicting the safeTxGas, then return the correct value', () => __awaiter(void 0, void 0, void 0, function* () {
            const to = EOA_ADDRESS;
            const value = '0';
            const data = '0x';
            const transactionDataMultisend = [
                { to, value, data },
                { to, value, data },
                { to, value, data }
            ];
            const safeTxGas = yield gasService_1.default.estimateSafeTxGas(WALLET_ADDRESS, transactionDataMultisend, new stubProvider_1.default());
            expect(safeTxGas).toEqual(mockedEstimateGas.mul(3));
        }));
    });
    describe('getGasPrice', () => {
        const rewardPercentile = 80;
        it('Given the correct parameters, when getting the gas price, then call eth_feeHistory with the correct parameters', () => __awaiter(void 0, void 0, void 0, function* () {
            const provider = new stubProvider_1.default();
            const send = jest.spyOn(provider, 'send');
            yield gasService_1.default.getGasPrice(provider, rewardPercentile);
            expect(send).toHaveBeenCalledWith('eth_feeHistory', [
                1,
                'latest',
                [rewardPercentile]
            ]);
        }));
        it('Given the correct parameters, when getting the gas price, then return the correct gas price', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield gasService_1.default.getGasPrice(new stubProvider_1.default(), rewardPercentile);
            const expectedResult = ethers_1.BigNumber.from(reward.add(baseFeePerGas)).add(ethers_1.BigNumber.from(reward.add(baseFeePerGas)).div(GAS_GAP_TOLERANCE));
            expect(result).toEqual(expectedResult);
        }));
    });
    describe('verifyHasEnoughBalance', () => {
        it('Given a low gas cost and txValue, when the wallet balance has enough to pay for gas and txValue, then resolve without throwing an error', () => __awaiter(void 0, void 0, void 0, function* () {
            const safeTxGas = 10;
            const gasPrice = 10000000000;
            const baseGas = 80000;
            const txValue = '12345';
            yield expect(gasService_1.default.verifyHasEnoughBalance(new stubProvider_1.default(), WALLET_ADDRESS, ethers_1.BigNumber.from(safeTxGas), ethers_1.BigNumber.from(gasPrice), baseGas, txValue)).resolves.not.toThrow();
        }));
        it('Given a low gas cost but high txValue, when the wallet balance does not have enough to pay for txValue, then throw an error', () => __awaiter(void 0, void 0, void 0, function* () {
            const safeTxGas = 10;
            const gasPrice = 10;
            const baseGas = 80000;
            const txValue = ethers_1.ethers.utils.parseUnits('0.12345', 'ether').toString();
            yield expect(gasService_1.default.verifyHasEnoughBalance(new stubProvider_1.default(), WALLET_ADDRESS, ethers_1.BigNumber.from(safeTxGas), ethers_1.BigNumber.from(gasPrice), baseGas, txValue)).rejects.toThrow(new Error('Not enough balance to send this value and pay for gas'));
        }));
        it('Given a high gas cost but low txValue, when the wallet balance does not have enough to pay for gas, then throw an error', () => __awaiter(void 0, void 0, void 0, function* () {
            const safeTxGas = 10000000000;
            const gasPrice = 10000000000;
            const baseGas = 8000000000000000;
            const txValue = '12345';
            yield expect(gasService_1.default.verifyHasEnoughBalance(new stubProvider_1.default(), WALLET_ADDRESS, ethers_1.BigNumber.from(safeTxGas), ethers_1.BigNumber.from(gasPrice), baseGas, txValue)).rejects.toThrow(new Error('Not enough balance to send this value and pay for gas'));
        }));
    });
});
