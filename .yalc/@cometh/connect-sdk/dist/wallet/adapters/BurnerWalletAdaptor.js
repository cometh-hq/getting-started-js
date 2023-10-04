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
exports.BurnerWalletAdaptor = void 0;
const ethers_1 = require("ethers");
const IConnectionSigning_1 = require("../IConnectionSigning");
class BurnerWalletAdaptor extends IConnectionSigning_1.IConnectionSigning {
    constructor(chainId, apiKey, baseUrl) {
        super(chainId, apiKey, baseUrl);
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            const currentPrivateKey = window.localStorage.getItem('burner-wallet-private-key');
            if (currentPrivateKey) {
                this.wallet = new ethers_1.ethers.Wallet(currentPrivateKey);
            }
            else {
                this.wallet = ethers_1.ethers.Wallet.createRandom();
                window.localStorage.setItem('burner-wallet-private-key', this.wallet.privateKey);
            }
            const walletAddress = yield this.getWalletAddress();
            yield this.signAndConnect(walletAddress, this.getSigner());
        });
    }
    logout() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.wallet)
                throw new Error('No Wallet instance found');
            this.wallet = undefined;
        });
    }
    getAccount() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.wallet)
                throw new Error('No Wallet instance found');
            return this.wallet.getAddress();
        });
    }
    getWalletAddress() {
        return __awaiter(this, void 0, void 0, function* () {
            const ownerAddress = yield this.getAccount();
            if (!ownerAddress)
                throw new Error('No owner address found');
            return yield this.API.getWalletAddress(ownerAddress);
        });
    }
    getSigner() {
        if (!this.wallet)
            throw new Error('No Wallet instance found');
        return this.wallet;
    }
    getUserInfos() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.wallet)
                throw new Error('No Wallet instance found');
            return (_a = { walletAddress: this.wallet.address }) !== null && _a !== void 0 ? _a : {};
        });
    }
}
exports.BurnerWalletAdaptor = BurnerWalletAdaptor;
