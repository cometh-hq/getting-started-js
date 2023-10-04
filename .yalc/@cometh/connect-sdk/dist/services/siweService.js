"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const siwe_1 = require("siwe");
const createMessage = (address, nonce, chainId) => {
    const domain = window.location.host;
    const origin = window.location.origin;
    const statement = `Sign in with Ethereum to Cometh Connect`;
    const message = new siwe_1.SiweMessage({
        domain,
        address,
        statement,
        uri: origin,
        version: '1',
        chainId,
        nonce: nonce === null || nonce === void 0 ? void 0 : nonce.connectionNonce
    });
    return message;
};
exports.default = {
    createMessage
};
