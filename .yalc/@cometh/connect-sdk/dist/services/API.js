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
exports.API = void 0;
const axios_1 = __importDefault(require("axios"));
const constants_1 = require("../constants");
class API {
    constructor(apiKey, chainId, baseUrl) {
        this.api = axios_1.default.create({ baseURL: baseUrl || constants_1.API_URL });
        this.api.defaults.headers.common['apikey'] = apiKey;
        this.api.defaults.headers.common['chainId'] = chainId;
    }
    getProjectParams() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.api.get(`/project/params`);
            return (_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.projectParams;
        });
    }
    getNonce(walletAddress) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.api.get(`/wallets/${walletAddress}/connection-nonce`);
            return (_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.userNonce;
        });
    }
    getWalletAddress(ownerAddress) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.api.get(`/wallets/${ownerAddress}/wallet-address`);
            return (_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.walletAddress;
        });
    }
    getWalletInfos(walletAddress) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.api.get(`/wallets/${walletAddress}/wallet-infos`);
            return (_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.walletInfos;
        });
    }
    getSponsoredAddresses() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.api.get(`/sponsored-address`);
            return (_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.sponsoredAddresses;
        });
    }
    connect({ message, signature, walletAddress }) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = {
                message,
                signature,
                walletAddress
            };
            const response = yield this.api.post(`/wallets/connect`, body);
            return response === null || response === void 0 ? void 0 : response.data.walletAddress;
        });
    }
    relayTransaction({ walletAddress, safeTxData, signatures }) {
        var _a, _b, _c, _d, _e;
        return __awaiter(this, void 0, void 0, function* () {
            const body = Object.assign(Object.assign({}, safeTxData), { nonce: (_a = safeTxData === null || safeTxData === void 0 ? void 0 : safeTxData.nonce) === null || _a === void 0 ? void 0 : _a.toString(), baseGas: (_b = safeTxData === null || safeTxData === void 0 ? void 0 : safeTxData.baseGas) === null || _b === void 0 ? void 0 : _b.toString(), gasPrice: (_c = safeTxData === null || safeTxData === void 0 ? void 0 : safeTxData.gasPrice) === null || _c === void 0 ? void 0 : _c.toString(), safeTxGas: (_d = safeTxData === null || safeTxData === void 0 ? void 0 : safeTxData.safeTxGas) === null || _d === void 0 ? void 0 : _d.toString(), signatures });
            const response = yield this.api.post(`/wallets/${walletAddress}/relay`, body);
            return (_e = response.data) === null || _e === void 0 ? void 0 : _e.safeTxHash;
        });
    }
    initWallet({ ownerAddress }) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = {
                ownerAddress
            };
            const response = yield this.api.post(`/wallets/init`, body);
            return response === null || response === void 0 ? void 0 : response.data.walletAddress;
        });
    }
    initWalletWithWebAuthn({ walletAddress, publicKeyId, publicKeyX, publicKeyY, deviceData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = {
                walletAddress,
                publicKeyId,
                publicKeyX,
                publicKeyY,
                deviceData
            };
            yield this.api.post(`/wallets/init-with-webauthn`, body);
        });
    }
    /**
     * User Section
     */
    initWalletForUserID({ token, ownerAddress }) {
        return __awaiter(this, void 0, void 0, function* () {
            const config = {
                headers: {
                    token
                }
            };
            const body = {
                ownerAddress
            };
            const response = yield this.api.post(`/user/init`, body, config);
            return response === null || response === void 0 ? void 0 : response.data.walletAddress;
        });
    }
    initWalletWithWebAuthnForUserID({ token, walletAddress, publicKeyId, publicKeyX, publicKeyY, deviceData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const config = {
                headers: {
                    token
                }
            };
            const body = {
                walletAddress,
                publicKeyId,
                publicKeyX,
                publicKeyY,
                deviceData
            };
            yield this.api.post(`/user/init-with-webauthn`, body, config);
        });
    }
    getWalletAddressFromUserID(token) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const config = {
                headers: {
                    token
                }
            };
            const response = yield this.api.get(`/user/address`, config);
            return (_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.walletAddress;
        });
    }
    createNewSignerRequest({ token, walletAddress, signerAddress, deviceData, type, publicKeyX, publicKeyY, publicKeyId }) {
        return __awaiter(this, void 0, void 0, function* () {
            const config = {
                headers: {
                    token
                }
            };
            const body = {
                walletAddress,
                signerAddress,
                deviceData,
                type,
                publicKeyX,
                publicKeyY,
                publicKeyId
            };
            yield this.api.post(`/user/new-signer-request`, body, config);
        });
    }
    deleteNewSignerRequest({ token, signerAddress }) {
        return __awaiter(this, void 0, void 0, function* () {
            const config = {
                headers: {
                    token
                }
            };
            yield this.api.delete(`/user/new-signer-request/${signerAddress}`, config);
        });
    }
    deployWebAuthnSigner({ token, walletAddress, publicKeyId, publicKeyX, publicKeyY, deviceData }) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const config = {
                headers: {
                    token
                }
            };
            const body = {
                walletAddress,
                publicKeyId,
                publicKeyX,
                publicKeyY,
                deviceData
            };
            const response = yield this.api.post(`/user/deploy-webauthn-signer`, body, config);
            return (_a = response.data) === null || _a === void 0 ? void 0 : _a.signerAddress;
        });
    }
    /**
     * WebAuthn Section
     */
    predictWebAuthnSignerAddress({ publicKeyX, publicKeyY }) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const body = {
                publicKeyX,
                publicKeyY
            };
            const response = yield this.api.post(`/webauthn-signer/predict-address`, body);
            return (_a = response.data) === null || _a === void 0 ? void 0 : _a.signerAddress;
        });
    }
    getWebAuthnSignerByPublicKeyId(publicKeyId) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.api.get(`/webauthn-signer/public-key-id/${publicKeyId}`);
            return (_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.webAuthnSigner;
        });
    }
    getWebAuthnSignersByWalletAddress(walletAddress) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.api.get(`/webauthn-signer/${walletAddress}`);
            return (_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.webAuthnSigners;
        });
    }
    /**
     * New signer request
     */
    getNewSignerRequests(walletAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.api.get(`/new-signer-request/${walletAddress}`);
            return response.data.signerRequests;
        });
    }
}
exports.API = API;
