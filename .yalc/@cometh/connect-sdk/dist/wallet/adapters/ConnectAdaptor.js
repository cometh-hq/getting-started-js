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
exports.ConnectAdaptor = void 0;
const providers_1 = require("@ethersproject/providers");
const ethers_1 = require("ethers");
const constants_1 = require("../../constants");
const services_1 = require("../../services");
const burnerWalletService_1 = __importDefault(require("../../services/burnerWalletService"));
const deviceService_1 = __importDefault(require("../../services/deviceService"));
const webAuthnService_1 = __importDefault(require("../../services/webAuthnService"));
const WebAuthnSigner_1 = require("../signers/WebAuthnSigner");
const types_1 = require("../types");
class ConnectAdaptor {
    constructor({ chainId, apiKey, userName, rpcUrl, baseUrl }) {
        this.chainId = chainId;
        this.userName = userName;
        this.API = new services_1.API(apiKey, +chainId, baseUrl);
        this.provider = new providers_1.StaticJsonRpcProvider(rpcUrl ? rpcUrl : constants_1.networks[+this.chainId].RPCUrl);
    }
    connect(walletAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            if (walletAddress)
                yield this._verifywalletAddress(walletAddress);
            this.projectParams = yield this.API.getProjectParams();
            const isWebAuthnCompatible = yield webAuthnService_1.default.isWebAuthnCompatible();
            if (!isWebAuthnCompatible) {
                this.signer = walletAddress
                    ? yield burnerWalletService_1.default.getSigner(this.API, this.provider, walletAddress)
                    : yield burnerWalletService_1.default.createSignerAndWallet(this.API);
            }
            else {
                try {
                    const { publicKeyId, signerAddress } = walletAddress
                        ? yield webAuthnService_1.default.getSigner(this.API, walletAddress)
                        : yield webAuthnService_1.default.createSignerAndWallet(this.API, this.userName);
                    this.signer = new WebAuthnSigner_1.WebAuthnSigner(publicKeyId, signerAddress);
                }
                catch (_a) {
                    throw new Error('New Domain detected. You need to add that domain as signer.');
                }
            }
            this.walletAddress = yield this._initAdaptorWalletAddress(walletAddress);
        });
    }
    _verifywalletAddress(walletAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            let connectWallet;
            try {
                connectWallet = yield this.API.getWalletInfos(walletAddress);
            }
            catch (_a) {
                throw new Error('Invalid address format');
            }
            if (!connectWallet)
                throw new Error('Wallet does not exist');
        });
    }
    _initAdaptorWalletAddress(walletAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.signer)
                throw new Error('No signer instance found');
            return walletAddress
                ? walletAddress
                : yield this.API.getWalletAddress(yield this.signer.getAddress());
        });
    }
    logout() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.signer)
                throw new Error('No signer instance found');
            this.signer = undefined;
        });
    }
    getAccount() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.signer)
                throw new Error('No signer instance found');
            return this.signer.getAddress();
        });
    }
    getSigner() {
        if (!this.signer)
            throw new Error('No signer instance found');
        return this.signer;
    }
    getWalletAddress() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.walletAddress)
                throw new Error('No wallet instance found');
            return this.walletAddress;
        });
    }
    getUserInfos() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            return (_a = { walletAddress: yield this.getAccount() }) !== null && _a !== void 0 ? _a : {};
        });
    }
    initNewSignerRequest(walletAddress, userName) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const isWebAuthnCompatible = yield webAuthnService_1.default.isWebAuthnCompatible();
            let addNewSignerRequest;
            if (isWebAuthnCompatible) {
                const { publicKeyX, publicKeyY, publicKeyId, signerAddress, deviceData } = yield webAuthnService_1.default.createWebAuthnSigner(this.API, userName);
                addNewSignerRequest = {
                    walletAddress,
                    signerAddress,
                    deviceData,
                    type: types_1.NewSignerRequestType.WEBAUTHN,
                    publicKeyId,
                    publicKeyX,
                    publicKeyY
                };
            }
            else {
                this.signer = ethers_1.ethers.Wallet.createRandom();
                window.localStorage.setItem(`cometh-connect-${walletAddress}`, this.signer.privateKey);
                addNewSignerRequest = {
                    walletAddress,
                    signerAddress: (_a = this.signer) === null || _a === void 0 ? void 0 : _a.address,
                    deviceData: deviceService_1.default.getDeviceData(),
                    type: types_1.NewSignerRequestType.BURNER_WALLET
                };
            }
            return addNewSignerRequest;
        });
    }
    getNewSignerRequests() {
        return __awaiter(this, void 0, void 0, function* () {
            const walletAddress = yield this.getWalletAddress();
            return yield this.API.getNewSignerRequests(walletAddress);
        });
    }
    waitWebAuthnSignerDeployment(publicKey_X, publicKey_Y) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.projectParams)
                throw new Error('No project Params found');
            yield webAuthnService_1.default.waitWebAuthnSignerDeployment(this.projectParams.P256FactoryContractAddress, publicKey_X, publicKey_Y, this.provider);
        });
    }
}
exports.ConnectAdaptor = ConnectAdaptor;
