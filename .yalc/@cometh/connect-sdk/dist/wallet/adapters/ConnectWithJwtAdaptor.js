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
exports.ConnectWithJwtAdaptor = void 0;
const providers_1 = require("@ethersproject/providers");
const ethers_1 = require("ethers");
const constants_1 = require("../../constants");
const services_1 = require("../../services");
const burnerWalletService_1 = __importDefault(require("../../services/burnerWalletService"));
const deviceService_1 = __importDefault(require("../../services/deviceService"));
const tokenService_1 = __importDefault(require("../../services/tokenService"));
const webAuthnService_1 = __importDefault(require("../../services/webAuthnService"));
const WebAuthnSigner_1 = require("../signers/WebAuthnSigner");
const types_1 = require("../types");
class ConnectWithJwtAdaptor {
    constructor({ chainId, jwtToken, apiKey, userName, rpcUrl, baseUrl }) {
        this.chainId = chainId;
        this.jwtToken = jwtToken;
        this.userName = userName;
        this.API = new services_1.API(apiKey, +chainId, baseUrl);
        this.provider = new providers_1.StaticJsonRpcProvider(rpcUrl ? rpcUrl : constants_1.networks[+this.chainId].RPCUrl);
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            this.projectParams = yield this.API.getProjectParams();
            const walletAddress = yield this.API.getWalletAddressFromUserID(this.jwtToken);
            const isWebAuthnCompatible = yield webAuthnService_1.default.isWebAuthnCompatible();
            const decodedToken = tokenService_1.default.decodeToken(this.jwtToken);
            const userId = decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.payload.sub;
            if (!isWebAuthnCompatible) {
                this.signer = walletAddress
                    ? yield burnerWalletService_1.default.getSignerForUserId(userId, this.API, this.provider, walletAddress)
                    : yield burnerWalletService_1.default.createSignerAndWalletForUserId(this.jwtToken, userId, this.API);
            }
            else {
                try {
                    const { publicKeyId, signerAddress } = walletAddress
                        ? yield webAuthnService_1.default.getSignerForUserId(walletAddress, userId, this.API)
                        : yield webAuthnService_1.default.createSignerAndWalletForUserId(this.jwtToken, userId, this.API, this.userName);
                    this.signer = new WebAuthnSigner_1.WebAuthnSigner(publicKeyId, signerAddress);
                }
                catch (_a) {
                    throw new Error('New Domain detected. You need to add that domain as signer.');
                }
            }
        });
    }
    logout() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.signer)
                throw new Error('No Wallet instance found');
            this.signer = undefined;
        });
    }
    getAccount() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.signer)
                throw new Error('No Wallet instance found');
            return this.signer.getAddress();
        });
    }
    getSigner() {
        if (!this.signer)
            throw new Error('No Wallet instance found');
        return this.signer;
    }
    getWalletAddress() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.API.getWalletAddressFromUserID(this.jwtToken);
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
            const decodedToken = tokenService_1.default.decodeToken(this.jwtToken);
            const userId = decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.payload.sub;
            if (!userId)
                throw new Error('No userId found');
            const isWebAuthnCompatible = yield webAuthnService_1.default.isWebAuthnCompatible();
            let addNewSignerRequest;
            if (isWebAuthnCompatible) {
                const { publicKeyX, publicKeyY, publicKeyId, signerAddress, deviceData } = yield webAuthnService_1.default.createWebAuthnSigner(this.API, userName, userId);
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
                window.localStorage.setItem(`cometh-connect-${userId}`, this.signer.privateKey);
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
    createNewSignerRequest(userName) {
        return __awaiter(this, void 0, void 0, function* () {
            const walletAddress = yield this.API.getWalletAddressFromUserID(this.jwtToken);
            const addNewSignerRequest = yield this.initNewSignerRequest(walletAddress, userName);
            yield this.API.createNewSignerRequest(Object.assign({ token: this.jwtToken }, addNewSignerRequest));
        });
    }
    getNewSignerRequests() {
        return __awaiter(this, void 0, void 0, function* () {
            const walletAddress = yield this.getWalletAddress();
            return yield this.API.getNewSignerRequests(walletAddress);
        });
    }
    deleteNewSignerRequest(signerAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.API.deleteNewSignerRequest({
                token: this.jwtToken,
                signerAddress
            });
        });
    }
    validateNewSignerRequest(newSignerRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.projectParams)
                throw new Error('Project params are null');
            yield this.deleteNewSignerRequest(newSignerRequest.signerAddress);
            if (newSignerRequest.type === types_1.NewSignerRequestType.WEBAUTHN) {
                if (!newSignerRequest.publicKeyId)
                    throw new Error('publicKeyId not valid');
                if (!newSignerRequest.publicKeyX)
                    throw new Error('publicKeyX not valid');
                if (!newSignerRequest.publicKeyY)
                    throw new Error('publicKeyY not valid');
                yield this.API.deployWebAuthnSigner({
                    token: this.jwtToken,
                    walletAddress: newSignerRequest.walletAddress,
                    publicKeyId: newSignerRequest.publicKeyId,
                    publicKeyX: newSignerRequest.publicKeyX,
                    publicKeyY: newSignerRequest.publicKeyY,
                    deviceData: newSignerRequest.deviceData
                });
                yield webAuthnService_1.default.waitWebAuthnSignerDeployment(this.projectParams.P256FactoryContractAddress, newSignerRequest.publicKeyX, newSignerRequest.publicKeyY, this.provider);
            }
            return newSignerRequest.signerAddress;
        });
    }
}
exports.ConnectWithJwtAdaptor = ConnectWithJwtAdaptor;
