"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const helpers_1 = require("@simplewebauthn/server/helpers");
const cbor_js_1 = __importDefault(require("cbor-js"));
const elliptic_1 = require("elliptic");
const ethers_1 = require("ethers");
const psl_1 = __importDefault(require("psl"));
const uuid_1 = require("uuid");
const constants_1 = require("../constants");
const factories_1 = require("../contracts/types/factories");
const utils = __importStar(require("../utils/utils"));
const deviceService_1 = __importDefault(require("./deviceService"));
const _formatCreatingRpId = () => {
    return psl_1.default.parse(window.location.host).domain
        ? {
            name: psl_1.default.parse(window.location.host).domain,
            id: psl_1.default.parse(window.location.host).domain
        }
        : { name: 'test' };
};
const _formatSigningRpId = () => {
    return (psl_1.default.parse(window.location.host).domain &&
        psl_1.default.parse(window.location.host).domain);
};
const createCredential = (userName) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const curve = new elliptic_1.ec('p256');
    const challenge = new TextEncoder().encode('credentialCreation');
    const webAuthnCredentials = yield navigator.credentials.create({
        publicKey: {
            rp: _formatCreatingRpId(),
            user: {
                id: new TextEncoder().encode((0, uuid_1.v4)()),
                name: userName ? userName : 'Cometh Connect',
                displayName: userName ? userName : 'Cometh Connect'
            },
            authenticatorSelection: { authenticatorAttachment: 'platform' },
            timeout: 20000,
            challenge,
            pubKeyCredParams: [{ alg: -7, type: 'public-key' }]
        }
    });
    const attestation = cbor_js_1.default.decode((_a = webAuthnCredentials === null || webAuthnCredentials === void 0 ? void 0 : webAuthnCredentials.response) === null || _a === void 0 ? void 0 : _a.attestationObject);
    const authData = (0, helpers_1.parseAuthenticatorData)(attestation.authData);
    const publicKey = cbor_js_1.default.decode((_b = authData === null || authData === void 0 ? void 0 : authData.credentialPublicKey) === null || _b === void 0 ? void 0 : _b.buffer);
    const x = publicKey[-2];
    const y = publicKey[-3];
    const point = curve.curve.point(x, y);
    return {
        point,
        id: utils.hexArrayStr(webAuthnCredentials.rawId)
    };
});
const createWebAuthnSigner = (API, userName, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const webAuthnCredentials = yield createCredential(userName);
    const publicKeyX = `0x${webAuthnCredentials.point.getX().toString(16)}`;
    const publicKeyY = `0x${webAuthnCredentials.point.getY().toString(16)}`;
    const publicKeyId = webAuthnCredentials.id;
    const signerAddress = yield API.predictWebAuthnSignerAddress({
        publicKeyX,
        publicKeyY
    });
    const deviceData = deviceService_1.default.getDeviceData();
    const walletAddress = yield API.getWalletAddress(signerAddress);
    if (userId) {
        _setWebauthnCredentialsInStorage(userId, publicKeyId, signerAddress);
    }
    else {
        /* Store WebAuthn credentials in storage */
        _setWebauthnCredentialsInStorage(walletAddress, publicKeyId, signerAddress);
    }
    return {
        publicKeyX,
        publicKeyY,
        publicKeyId,
        signerAddress,
        deviceData,
        walletAddress
    };
});
const sign = (challenge, publicKeyCredential) => __awaiter(void 0, void 0, void 0, function* () {
    const assertionPayload = yield navigator.credentials.get({
        publicKey: {
            challenge,
            rpId: _formatSigningRpId(),
            allowCredentials: publicKeyCredential,
            timeout: 20000
        }
    });
    return assertionPayload;
});
const getWebAuthnSignature = (hash, publicKeyCredential) => __awaiter(void 0, void 0, void 0, function* () {
    const challenge = utils.parseHex(hash.slice(2));
    const assertionPayload = yield sign(challenge, publicKeyCredential);
    const publicKeyId = utils.hexArrayStr(assertionPayload.rawId);
    const { signature, authenticatorData, clientDataJSON: clientData } = assertionPayload.response;
    const rs = utils.derToRS(new Uint8Array(signature));
    const challengeOffset = utils.findSequence(new Uint8Array(clientData), utils.parseHex(constants_1.challengePrefix)) +
        12 +
        1;
    const encodedSignature = ethers_1.ethers.utils.defaultAbiCoder.encode(['bytes', 'bytes', 'uint256', 'uint256[2]'], [
        utils.hexArrayStr(authenticatorData),
        utils.hexArrayStr(clientData),
        challengeOffset,
        [utils.hexArrayStr(rs[0]), utils.hexArrayStr(rs[1])]
    ]);
    return { encodedSignature, publicKeyId };
});
const waitWebAuthnSignerDeployment = (P256FactoryContractAddress, publicKey_X, publicKey_Y, provider) => __awaiter(void 0, void 0, void 0, function* () {
    const P256FactoryInstance = yield factories_1.P256SignerFactory__factory.connect(P256FactoryContractAddress, provider);
    let signerDeploymentEvent = [];
    while (signerDeploymentEvent.length === 0) {
        yield new Promise((resolve) => setTimeout(resolve, 2000));
        signerDeploymentEvent = yield P256FactoryInstance.queryFilter(P256FactoryInstance.filters.NewSignerCreated(publicKey_X, publicKey_Y), constants_1.BLOCK_EVENT_GAP);
    }
    return signerDeploymentEvent[0].args.signer;
});
const isWebAuthnCompatible = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!window.PublicKeyCredential)
        return false;
    const isUserVerifyingPlatformAuthenticatorAvailable = yield PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    if (!isUserVerifyingPlatformAuthenticatorAvailable)
        return false;
    return true;
});
const signWithWebAuthn = (webAuthnSigners, challenge) => __awaiter(void 0, void 0, void 0, function* () {
    const publicKeyCredentials = webAuthnSigners.map((webAuthnSigner) => {
        return {
            id: utils.parseHex(webAuthnSigner.publicKeyId),
            type: 'public-key'
        };
    });
    const { encodedSignature, publicKeyId } = yield getWebAuthnSignature(ethers_1.ethers.utils.keccak256(ethers_1.ethers.utils.hashMessage(challenge)), publicKeyCredentials);
    return { encodedSignature, publicKeyId };
});
const _setWebauthnCredentialsInStorage = (walletAddress, publicKeyId, signerAddress) => {
    const localStorageWebauthnCredentials = JSON.stringify({
        publicKeyId,
        signerAddress
    });
    window.localStorage.setItem(`cometh-connect-${walletAddress}`, localStorageWebauthnCredentials);
};
const _getWebauthnCredentialsInStorage = (walletAddress) => {
    return window.localStorage.getItem(`cometh-connect-${walletAddress}`);
};
const createSignerAndWallet = (API, userName) => __awaiter(void 0, void 0, void 0, function* () {
    /* Create WebAuthn credentials */
    const { publicKeyX, publicKeyY, publicKeyId, signerAddress, deviceData, walletAddress } = yield createWebAuthnSigner(API, userName);
    /* Create Wallet and Webauthn signer in db */
    yield API.initWalletWithWebAuthn({
        walletAddress,
        publicKeyId,
        publicKeyX,
        publicKeyY,
        deviceData
    });
    return { publicKeyId, signerAddress };
});
const createSignerAndWalletForUserId = (token, userId, API, userName) => __awaiter(void 0, void 0, void 0, function* () {
    /* Create WebAuthn credentials */
    const { publicKeyX, publicKeyY, publicKeyId, signerAddress, deviceData } = yield createWebAuthnSigner(API, userName, userId);
    /* Create Wallet and Webauthn signer in db */
    yield API.initWalletWithWebAuthnForUserID({
        token,
        walletAddress: yield API.getWalletAddress(signerAddress),
        publicKeyId,
        publicKeyX,
        publicKeyY,
        deviceData
    });
    return { publicKeyId, signerAddress };
});
const getSigner = (API, walletAddress) => __awaiter(void 0, void 0, void 0, function* () {
    const webAuthnSigners = yield API.getWebAuthnSignersByWalletAddress(walletAddress);
    if (webAuthnSigners.length === 0)
        throw new Error('New Domain detected. You need to add that domain as signer');
    /* Retrieve potentiel WebAuthn credentials in storage */
    const localStorageWebauthnCredentials = _getWebauthnCredentialsInStorage(walletAddress);
    if (localStorageWebauthnCredentials) {
        /* Check if storage WebAuthn credentials exists in db */
        const registeredWebauthnSigner = yield API.getWebAuthnSignerByPublicKeyId(JSON.parse(localStorageWebauthnCredentials).publicKeyId);
        /* If signer exists in db, instantiate WebAuthn signer  */
        if (registeredWebauthnSigner)
            return {
                publicKeyId: registeredWebauthnSigner.publicKeyId,
                signerAddress: registeredWebauthnSigner.signerAddress
            };
    }
    /* If no local storage or no match in db, Call Webauthn API to get current signer */
    let signatureParams;
    try {
        signatureParams = yield signWithWebAuthn(webAuthnSigners, 'SDK Connection');
    }
    catch (_c) {
        throw new Error('New Domain detected. You need to add that domain as signer');
    }
    const signingWebAuthnSigner = yield API.getWebAuthnSignerByPublicKeyId(signatureParams.publicKeyId);
    /* Store WebAuthn credentials in storage */
    _setWebauthnCredentialsInStorage(walletAddress, signatureParams.publicKeyId, signatureParams.signerAddress);
    return {
        publicKeyId: signingWebAuthnSigner.publicKeyId,
        signerAddress: signingWebAuthnSigner.signerAddress
    };
});
const getSignerForUserId = (walletAddress, userId, API) => __awaiter(void 0, void 0, void 0, function* () {
    const webAuthnSigners = yield API.getWebAuthnSignersByWalletAddress(walletAddress);
    if (webAuthnSigners.length === 0)
        throw new Error('New Domain detected. You need to add that domain as signer');
    /* Retrieve potentiel WebAuthn credentials in storage */
    const localStorageWebauthnCredentials = _getWebauthnCredentialsInStorage(userId);
    if (localStorageWebauthnCredentials) {
        /* Check if storage WebAuthn credentials exists in db */
        const registeredWebauthnSigner = yield API.getWebAuthnSignerByPublicKeyId(JSON.parse(localStorageWebauthnCredentials).publicKeyId);
        /* If signer exists in db, instantiate WebAuthn signer  */
        if (registeredWebauthnSigner)
            return {
                publicKeyId: registeredWebauthnSigner.publicKeyId,
                signerAddress: registeredWebauthnSigner.signerAddress
            };
    }
    /* If no local storage or no match in db, Call Webauthn API to get current signer */
    let signatureParams;
    try {
        signatureParams = yield signWithWebAuthn(webAuthnSigners, 'SDK Connection');
    }
    catch (_d) {
        throw new Error('New Domain detected. You need to add that domain as signer');
    }
    const signingWebAuthnSigner = yield API.getWebAuthnSignerByPublicKeyId(signatureParams.publicKeyId);
    /* Store WebAuthn credentials in storage */
    _setWebauthnCredentialsInStorage(userId, signatureParams.publicKeyId, signatureParams.signerAddress);
    return {
        publicKeyId: signingWebAuthnSigner.publicKeyId,
        signerAddress: signingWebAuthnSigner.signerAddress
    };
});
exports.default = {
    createCredential,
    sign,
    getWebAuthnSignature,
    waitWebAuthnSignerDeployment,
    isWebAuthnCompatible,
    createWebAuthnSigner,
    signWithWebAuthn,
    createSignerAndWallet,
    createSignerAndWalletForUserId,
    getSigner,
    getSignerForUserId
};
