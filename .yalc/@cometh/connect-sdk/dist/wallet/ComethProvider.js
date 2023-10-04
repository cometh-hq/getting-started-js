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
exports.ComethProvider = void 0;
const providers_1 = require("@ethersproject/providers");
const constants_1 = require("../constants");
const ComethSigner_1 = require("./ComethSigner");
const RelayTransactionResponse_1 = require("./RelayTransactionResponse");
class ComethProvider extends providers_1.BaseProvider {
    constructor(wallet) {
        var _a;
        super({
            name: 'Connect Custom Network',
            chainId: (_a = wallet.chainId) !== null && _a !== void 0 ? _a : constants_1.DEFAULT_CHAIN_ID
        });
        this.wallet = wallet;
        this.signer = new ComethSigner_1.ComethSigner(wallet, this);
    }
    getSigner() {
        return this.signer;
    }
    perform(method, params) {
        return __awaiter(this, void 0, void 0, function* () {
            if (method === 'sendTransaction') {
                throw new Error('Not authorized method: sendTransaction');
            }
            return yield this.wallet.getProvider().perform(method, params);
        });
    }
    send(method, params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.wallet.getProvider().send(method, params);
        });
    }
    getTransaction(safeTxHash) {
        return __awaiter(this, void 0, void 0, function* () {
            return new RelayTransactionResponse_1.RelayTransactionResponse(safeTxHash, this, this.wallet);
        });
    }
    getTransactionReceipt(transactionHash) {
        const _super = Object.create(null, {
            getTransactionReceipt: { get: () => super.getTransactionReceipt }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return _super.getTransactionReceipt.call(this, transactionHash);
        });
    }
    waitForTransaction(transactionHash, confirmations, timeout) {
        const _super = Object.create(null, {
            waitForTransaction: { get: () => super.waitForTransaction }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return _super.waitForTransaction.call(this, transactionHash, confirmations, timeout);
        });
    }
    detectNetwork() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.wallet.getProvider().detectNetwork();
        });
    }
    eth_accounts() {
        return [this.wallet.getAddress()];
    }
}
exports.ComethProvider = ComethProvider;
