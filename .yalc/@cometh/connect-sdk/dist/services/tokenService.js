"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = require("jsonwebtoken");
const decodeToken = (token) => {
    return (0, jsonwebtoken_1.decode)(token, { complete: true });
};
exports.default = {
    decodeToken
};
