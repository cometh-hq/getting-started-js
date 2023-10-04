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
const isDeployed = (walletAddress, provider) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield factories_1.Safe__factory.connect(walletAddress, provider).deployed();
        return true;
    }
    catch (error) {
        return false;
    }
});
const getNonce = (walletAddress, provider) => __awaiter(void 0, void 0, void 0, function* () {
    return (yield isDeployed(walletAddress, provider))
        ? (yield factories_1.Safe__factory.connect(walletAddress, provider).nonce()).toNumber()
        : 0;
});
const getSuccessExecTransactionEvent = (safeTxHash, walletAddress, provider) => __awaiter(void 0, void 0, void 0, function* () {
    const safeInstance = yield factories_1.Safe__factory.connect(walletAddress, provider);
    const transactionEvents = yield safeInstance.queryFilter(safeInstance.filters.ExecutionSuccess(), constants_1.BLOCK_EVENT_GAP);
    const filteredTransactionEvent = transactionEvents.filter((e) => e.args.txHash === safeTxHash);
    return filteredTransactionEvent[0];
});
const getFailedExecTransactionEvent = (safeTxHash, walletAddress, provider) => __awaiter(void 0, void 0, void 0, function* () {
    const safeInstance = yield factories_1.Safe__factory.connect(walletAddress, provider);
    const transactionEvents = yield safeInstance.queryFilter(safeInstance.filters.ExecutionFailure(), constants_1.BLOCK_EVENT_GAP);
    const filteredTransactionEvent = transactionEvents.filter((e) => e.args.txHash === safeTxHash);
    return filteredTransactionEvent[0];
});
const isSafeOwner = (walletAddress, signerAddress, provider) => __awaiter(void 0, void 0, void 0, function* () {
    const safeInstance = yield factories_1.Safe__factory.connect(walletAddress, provider);
    if ((yield isDeployed(walletAddress, provider)) === true) {
        return yield safeInstance.isOwner(signerAddress);
    }
    else {
        throw new Error('wallet is not deployed');
    }
});
const getOwners = (walletAddress, provider) => __awaiter(void 0, void 0, void 0, function* () {
    const safeInstance = yield factories_1.Safe__factory.connect(walletAddress, provider);
    if ((yield isDeployed(walletAddress, provider)) === true) {
        return yield safeInstance.getOwners();
    }
    else {
        throw new Error('wallet is not deployed');
    }
});
const prepareAddOwnerTx = (walletAddress, newOwner) => __awaiter(void 0, void 0, void 0, function* () {
    const tx = {
        to: walletAddress,
        value: '0x0',
        data: SafeInterface.encodeFunctionData('addOwnerWithThreshold', [
            newOwner,
            1
        ]),
        operation: 0,
        safeTxGas: 0,
        baseGas: 0,
        gasPrice: 0,
        gasToken: ethers_1.ethers.constants.AddressZero,
        refundReceiver: ethers_1.ethers.constants.AddressZero
    };
    return tx;
});
const formatWebAuthnSignatureForSafe = (signerAddress, signature) => {
    return `${ethers_1.ethers.utils.defaultAbiCoder.encode(['uint256', 'uint256'], [signerAddress, 65])}00${ethers_1.ethers.utils
        .hexZeroPad(ethers_1.ethers.utils.hexValue(ethers_1.ethers.utils.arrayify(signature).length), 32)
        .slice(2)}${signature.slice(2)}`;
};
const getSafeTransactionHash = (walletAddress, transactionData, chainId) => {
    return ethers_1.ethers.utils._TypedDataEncoder.hash({
        chainId,
        verifyingContract: walletAddress
    }, constants_1.EIP712_SAFE_TX_TYPES, transactionData);
};
const getTransactionsTotalValue = (safeTxData) => __awaiter(void 0, void 0, void 0, function* () {
    let txValue = 0;
    for (let i = 0; i < safeTxData.length; i++) {
        txValue += parseInt(safeTxData[i].value);
    }
    return txValue.toString();
});
const isSigner = (signerAddress, walletAddress, provider, API) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield isDeployed(walletAddress, provider);
        const owner = yield isSafeOwner(walletAddress, signerAddress, provider);
        if (!owner)
            return false;
    }
    catch (_a) {
        const predictedWalletAddress = yield API.getWalletAddress(signerAddress);
        if (predictedWalletAddress !== walletAddress)
            return false;
    }
    return true;
});
const getFunctionSelector = (transactionData) => {
    return transactionData.data.toString().slice(0, 10);
};
exports.default = {
    isDeployed,
    getNonce,
    getSuccessExecTransactionEvent,
    getFailedExecTransactionEvent,
    isSafeOwner,
    getOwners,
    prepareAddOwnerTx,
    formatWebAuthnSignatureForSafe,
    getSafeTransactionHash,
    getTransactionsTotalValue,
    isSigner,
    getFunctionSelector
};
