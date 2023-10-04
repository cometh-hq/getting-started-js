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
exports.ComethWallet = void 0;
const providers_1 = require("@ethersproject/providers");
const ethers_1 = require("ethers");
const ethers_multisend_1 = require("ethers-multisend");
const constants_1 = require("../constants");
const services_1 = require("../services");
const gasService_1 = __importDefault(require("../services/gasService"));
const safeService_1 = __importDefault(require("../services/safeService"));
const ui_1 = require("../ui");
class ComethWallet {
    constructor({ authAdapter, apiKey, rpcUrl, baseUrl }) {
        this.connected = false;
        this.uiConfig = {
            displayValidationModal: true
        };
        this.authAdapter = authAdapter;
        this.chainId = +authAdapter.chainId;
        this.API = new services_1.API(apiKey, this.chainId, baseUrl);
        this.provider = new providers_1.StaticJsonRpcProvider(rpcUrl ? rpcUrl : constants_1.networks[this.chainId].RPCUrl);
        this.BASE_GAS = constants_1.DEFAULT_BASE_GAS;
        this.REWARD_PERCENTILE = constants_1.DEFAULT_REWARD_PERCENTILE;
    }
    /**
     * Connection Section
     */
    connect(walletAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!constants_1.networks[this.chainId])
                throw new Error('This network is not supported');
            if (!this.authAdapter)
                throw new Error('No EOA adapter found');
            yield this.authAdapter.connect(walletAddress);
            this.projectParams = yield this.API.getProjectParams();
            this.signer = this.authAdapter.getSigner();
            this.walletAddress = yield this.authAdapter.getWalletAddress();
            if (!this.signer)
                throw new Error('No signer found');
            if (!this.walletAddress)
                throw new Error('No walletAddress found');
            this.sponsoredAddresses = yield this.API.getSponsoredAddresses();
            this.connected = true;
        });
    }
    getConnected() {
        return this.connected;
    }
    getProvider() {
        return this.provider;
    }
    getUserInfos() {
        return __awaiter(this, void 0, void 0, function* () {
            const walletInfos = yield this.API.getWalletInfos(this.getAddress());
            return walletInfos;
        });
    }
    getAddress() {
        var _a;
        return (_a = this.walletAddress) !== null && _a !== void 0 ? _a : '';
    }
    logout() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.authAdapter)
                yield this.authAdapter.logout();
            this.connected = false;
        });
    }
    addOwner(newOwner) {
        return __awaiter(this, void 0, void 0, function* () {
            const tx = yield safeService_1.default.prepareAddOwnerTx(this.getAddress(), newOwner);
            return yield this.sendTransaction(tx);
        });
    }
    getOwners() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.walletAddress)
                throw new Error('no wallet Address');
            return yield safeService_1.default.getOwners(this.walletAddress, this.provider);
        });
    }
    /**
     * Signing Message Section
     */
    signMessage(messageToSign) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof messageToSign === 'string') {
                messageToSign = ethers_1.ethers.utils.hashMessage(messageToSign);
            }
            if (!this.signer)
                throw new Error('Sign message: missing signer');
            return yield this.signer._signTypedData({
                chainId: this.chainId,
                verifyingContract: this.getAddress()
            }, constants_1.EIP712_SAFE_MESSAGE_TYPE, { message: messageToSign });
        });
    }
    signTransaction(safeTxData) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.signer)
                throw new Error('Sign message: missing signer');
            return yield this.signer._signTypedData({
                chainId: this.chainId,
                verifyingContract: this.getAddress()
            }, constants_1.EIP712_SAFE_TX_TYPES, {
                to: safeTxData.to,
                value: ethers_1.BigNumber.from(safeTxData.value).toString(),
                data: safeTxData.data,
                operation: safeTxData.operation,
                safeTxGas: ethers_1.BigNumber.from(safeTxData.safeTxGas).toString(),
                baseGas: ethers_1.BigNumber.from(safeTxData.baseGas).toString(),
                gasPrice: ethers_1.BigNumber.from(safeTxData.gasPrice).toString(),
                gasToken: ethers_1.ethers.constants.AddressZero,
                refundReceiver: ethers_1.ethers.constants.AddressZero,
                nonce: ethers_1.BigNumber.from(safeTxData.nonce
                    ? safeTxData.nonce
                    : yield safeService_1.default.getNonce(this.getAddress(), this.getProvider())).toString()
            });
        });
    }
    _isSponsoredTransaction(safeTransactionData) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            for (let i = 0; i < safeTransactionData.length; i++) {
                const functionSelector = safeService_1.default.getFunctionSelector(safeTransactionData[i]);
                const sponsoredAddress = (_a = this.sponsoredAddresses) === null || _a === void 0 ? void 0 : _a.find((sponsoredAddress) => sponsoredAddress.targetAddress.toLowerCase() ===
                    safeTransactionData[i].to.toLowerCase());
                if (!sponsoredAddress && functionSelector !== constants_1.ADD_OWNER_FUNCTION_SELECTOR)
                    return false;
            }
            return true;
        });
    }
    _signAndSendTransaction(safeTxDataTyped) {
        return __awaiter(this, void 0, void 0, function* () {
            const txSignature = yield this.signTransaction(safeTxDataTyped);
            return yield this.API.relayTransaction({
                safeTxData: safeTxDataTyped,
                signatures: txSignature,
                walletAddress: this.getAddress()
            });
        });
    }
    sendTransaction(safeTxData) {
        return __awaiter(this, void 0, void 0, function* () {
            const safeTxGas = yield gasService_1.default.estimateSafeTxGas(this.getAddress(), [safeTxData], this.provider);
            const safeTxDataTyped = Object.assign({}, (yield this._prepareTransaction(safeTxData.to, safeTxData.value, safeTxData.data)));
            if (!(yield this._isSponsoredTransaction([safeTxDataTyped]))) {
                const gasPrice = yield gasService_1.default.getGasPrice(this.provider, this.REWARD_PERCENTILE);
                yield gasService_1.default.verifyHasEnoughBalance(this.provider, this.getAddress(), safeTxGas, gasPrice, this.BASE_GAS, safeTxData.value);
                if (this.uiConfig.displayValidationModal) {
                    yield this.displayModal(safeTxGas, gasPrice);
                }
                safeTxDataTyped.safeTxGas = +safeTxGas;
                safeTxDataTyped.baseGas = this.BASE_GAS;
                safeTxDataTyped.gasPrice = +gasPrice;
            }
            const safeTxHash = yield this._signAndSendTransaction(safeTxDataTyped);
            return { safeTxHash };
        });
    }
    sendBatchTransactions(safeTxData) {
        return __awaiter(this, void 0, void 0, function* () {
            if (safeTxData.length === 0) {
                throw new Error('Empty array provided, no transaction to send');
            }
            if (!this.projectParams)
                throw new Error('Project params are null');
            const safeTxGas = yield gasService_1.default.estimateSafeTxGas(this.getAddress(), safeTxData, this.provider);
            const safeTxDataTyped = Object.assign({}, (yield this._prepareTransaction(this.projectParams.multisendContractAddress, '0', (0, ethers_multisend_1.encodeMulti)(safeTxData).data, 1)));
            if (!(yield this._isSponsoredTransaction(safeTxData))) {
                const txValue = yield safeService_1.default.getTransactionsTotalValue(safeTxData);
                const gasPrice = yield gasService_1.default.getGasPrice(this.provider, this.REWARD_PERCENTILE);
                yield gasService_1.default.verifyHasEnoughBalance(this.provider, this.getAddress(), safeTxGas, gasPrice, this.BASE_GAS, txValue);
                if (this.uiConfig.displayValidationModal) {
                    this.displayModal(safeTxGas, gasPrice);
                }
                safeTxDataTyped.safeTxGas = +safeTxGas;
                safeTxDataTyped.baseGas = this.BASE_GAS;
                safeTxDataTyped.gasPrice = +gasPrice;
            }
            const safeTxHash = yield this._signAndSendTransaction(safeTxDataTyped);
            return { safeTxHash };
        });
    }
    displayModal(safeTxGas, gasPrice) {
        return __awaiter(this, void 0, void 0, function* () {
            const walletBalance = yield this.provider.getBalance(this.getAddress());
            const totalGasCost = yield gasService_1.default.getTotalCost(safeTxGas, this.BASE_GAS, gasPrice);
            const displayedTotalBalance = (+ethers_1.ethers.utils.formatEther(ethers_1.ethers.utils.parseUnits(walletBalance.toString(), 'wei'))).toFixed(3);
            const displayedTotalGasCost = (+ethers_1.ethers.utils.formatEther(ethers_1.ethers.utils.parseUnits(totalGasCost.toString(), 'wei'))).toFixed(3);
            if (!(yield new ui_1.GasModal().initModal(displayedTotalBalance, displayedTotalGasCost))) {
                throw new Error('Transaction denied');
            }
        });
    }
    _prepareTransaction(to, value, data, operation) {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                to: to,
                value: value !== null && value !== void 0 ? value : '0',
                data: data,
                operation: operation !== null && operation !== void 0 ? operation : 0,
                safeTxGas: 0,
                baseGas: 0,
                gasPrice: 0,
                gasToken: ethers_1.ethers.constants.AddressZero,
                refundReceiver: ethers_1.ethers.constants.AddressZero,
                nonce: yield safeService_1.default.getNonce(this.getAddress(), this.getProvider())
            };
        });
    }
}
exports.ComethWallet = ComethWallet;
