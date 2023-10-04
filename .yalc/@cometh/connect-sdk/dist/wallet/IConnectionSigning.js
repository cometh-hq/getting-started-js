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
exports.IConnectionSigning = void 0;
const ethers_1 = require("ethers");
const constants_1 = require("../constants");
const services_1 = require("../services");
const siweService_1 = __importDefault(require("../services/siweService"));
class IConnectionSigning {
    constructor(chainId, apiKey, baseUrl) {
        this.chainId = chainId;
        this.API = new services_1.API(apiKey, +chainId, baseUrl);
    }
    signAndConnect(walletAddress, signer) {
        return __awaiter(this, void 0, void 0, function* () {
            const nonce = yield this.API.getNonce(walletAddress);
            const message = siweService_1.default.createMessage(walletAddress, nonce, +this.chainId);
            const signature = yield this.signMessage(walletAddress, message.prepareMessage(), signer);
            yield this.API.connect({
                message,
                signature,
                walletAddress
            });
        });
    }
    signMessage(walletAddress, messageToSign, signer) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof messageToSign === 'string') {
                messageToSign = ethers_1.ethers.utils.hashMessage(messageToSign);
            }
            if (!signer)
                throw new Error('Sign message: missing signer');
            return yield signer._signTypedData({
                chainId: this.chainId,
                verifyingContract: walletAddress
            }, constants_1.EIP712_SAFE_MESSAGE_TYPE, { message: messageToSign });
        });
    }
}
exports.IConnectionSigning = IConnectionSigning;
