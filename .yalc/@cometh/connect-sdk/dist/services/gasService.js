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
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const constants_1 = require("../constants");
const factories_1 = require("../contracts/types/factories");
const SafeInterface = factories_1.Safe__factory.createInterface();
const getGasPrice = (provider, rewardPercentile) => __awaiter(void 0, void 0, void 0, function* () {
    const ethFeeHistory = yield provider.send('eth_feeHistory', [
        1,
        'latest',
        [rewardPercentile]
    ]);
    const [reward, BaseFee] = [
        ethers_1.BigNumber.from(ethFeeHistory.reward[0][0]),
        ethers_1.BigNumber.from(ethFeeHistory.baseFeePerGas[0])
    ];
    const gasPrice = ethers_1.BigNumber.from(reward.add(BaseFee)).add(ethers_1.BigNumber.from(reward.add(BaseFee)).div(constants_1.GAS_GAP_TOLERANCE));
    return gasPrice;
});
const estimateSafeTxGas = (walletAddress, safeTransactionData, provider) => __awaiter(void 0, void 0, void 0, function* () {
    let safeTxGas = ethers_1.BigNumber.from(0);
    for (let i = 0; i < safeTransactionData.length; i++) {
        safeTxGas = safeTxGas.add(yield provider.estimateGas(Object.assign(Object.assign({}, safeTransactionData[i]), { from: walletAddress })));
    }
    return safeTxGas;
});
const getTotalCost = (safeTxGas, baseGas, gasPrice) => __awaiter(void 0, void 0, void 0, function* () {
    return ethers_1.BigNumber.from(safeTxGas)
        .add(ethers_1.BigNumber.from(baseGas))
        .mul(ethers_1.BigNumber.from(gasPrice));
});
const verifyHasEnoughBalance = (provider, walletAddress, safeTxGas, gasPrice, baseGas, txValue) => __awaiter(void 0, void 0, void 0, function* () {
    const walletBalance = yield provider.getBalance(walletAddress);
    const totalGasCost = yield getTotalCost(safeTxGas, baseGas, gasPrice);
    if (walletBalance.lt(totalGasCost.add(ethers_1.BigNumber.from(txValue))))
        throw new Error('Not enough balance to send this value and pay for gas');
});
exports.default = {
    getGasPrice,
    estimateSafeTxGas,
    getTotalCost,
    verifyHasEnoughBalance
};
