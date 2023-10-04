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
exports.getSignerForUserId = exports.getSigner = exports.createSignerAndWalletForUserId = exports.createSignerAndWallet = void 0;
const ethers_1 = require("ethers");
const safeService_1 = __importDefault(require("./safeService"));
const createSignerAndWallet = (API) => __awaiter(void 0, void 0, void 0, function* () {
    const newSigner = ethers_1.ethers.Wallet.createRandom();
    const walletAddress = yield API.initWallet({
        ownerAddress: newSigner.address
    });
    window.localStorage.setItem(`cometh-connect-${walletAddress}`, newSigner.privateKey);
    return newSigner;
});
exports.createSignerAndWallet = createSignerAndWallet;
const createSignerAndWalletForUserId = (token, userId, API) => __awaiter(void 0, void 0, void 0, function* () {
    const newSigner = ethers_1.ethers.Wallet.createRandom();
    window.localStorage.setItem(`cometh-connect-${userId}`, newSigner.privateKey);
    yield API.initWalletForUserID({
        token,
        ownerAddress: newSigner.address
    });
    return newSigner;
});
exports.createSignerAndWalletForUserId = createSignerAndWalletForUserId;
const getSigner = (API, provider, walletAddress) => __awaiter(void 0, void 0, void 0, function* () {
    const storagePrivateKey = window.localStorage.getItem(`cometh-connect-${walletAddress}`);
    if (!storagePrivateKey)
        throw new Error('New Domain detected. You need to add that domain as signer.');
    const storageSigner = new ethers_1.ethers.Wallet(storagePrivateKey);
    const isOwner = yield safeService_1.default.isSigner(storageSigner.address, walletAddress, provider, API);
    if (!isOwner)
        throw new Error('New Domain detected. You need to add that domain as signer.');
    return storageSigner;
});
exports.getSigner = getSigner;
const getSignerForUserId = (userId, API, provider, walletAddress) => __awaiter(void 0, void 0, void 0, function* () {
    const storagePrivateKey = window.localStorage.getItem(`cometh-connect-${userId}`);
    if (!storagePrivateKey)
        throw new Error('New Domain detected. You need to add that domain as signer.');
    const storageSigner = new ethers_1.ethers.Wallet(storagePrivateKey);
    const isOwner = yield safeService_1.default.isSigner(storageSigner.address, walletAddress, provider, API);
    if (!isOwner)
        throw new Error('New Domain detected. You need to add that domain as signer.');
    return storageSigner;
});
exports.getSignerForUserId = getSignerForUserId;
exports.default = {
    createSignerAndWallet: exports.createSignerAndWallet,
    createSignerAndWalletForUserId: exports.createSignerAndWalletForUserId,
    getSigner: exports.getSigner,
    getSignerForUserId: exports.getSignerForUserId
};
