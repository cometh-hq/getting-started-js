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
exports.WebAuthnSigner = void 0;
const abstract_signer_1 = require("@ethersproject/abstract-signer");
const ethers_1 = require("ethers");
const constants_1 = require("../../constants");
const safeService_1 = __importDefault(require("../../services/safeService"));
const webAuthnService_1 = __importDefault(require("../../services/webAuthnService"));
const utils_1 = require("../../utils/utils");
class WebAuthnSigner extends abstract_signer_1.Signer {
    constructor(publicKeyId, signerAddress) {
        super();
        this.publicKeyId = publicKeyId;
        this.signerAddress = signerAddress;
    }
    getAddress() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            return (_a = this.signerAddress) !== null && _a !== void 0 ? _a : '';
        });
    }
    _signTypedData(domain, types, value) {
        return __awaiter(this, void 0, void 0, function* () {
            if (types !== constants_1.EIP712_SAFE_TX_TYPES && types !== constants_1.EIP712_SAFE_MESSAGE_TYPE)
                throw new Error('types data not supported');
            const data = types === constants_1.EIP712_SAFE_TX_TYPES
                ? ethers_1.ethers.utils._TypedDataEncoder.hash(domain, types, value)
                : ethers_1.ethers.utils.keccak256(value.message);
            const publicKeyCredential = [
                {
                    id: (0, utils_1.parseHex)(this.publicKeyId),
                    type: 'public-key'
                }
            ];
            const { encodedSignature } = yield webAuthnService_1.default.getWebAuthnSignature(data, publicKeyCredential);
            return safeService_1.default.formatWebAuthnSignatureForSafe(this.signerAddress, encodedSignature);
        });
    }
    signTransaction(safeTxDataTyped) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('Not authorized method: signTransaction');
        });
    }
    signMessage(messageToSign) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('Not authorized method: signMessage');
        });
    }
    connect(provider) {
        throw new Error('Not authorized method: connect');
    }
}
exports.WebAuthnSigner = WebAuthnSigner;
