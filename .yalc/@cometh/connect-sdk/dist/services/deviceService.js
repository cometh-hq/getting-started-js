"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bowser_1 = __importDefault(require("bowser"));
const getDeviceData = () => {
    var _a;
    const userAgentDataBrands = navigator.userAgentData
        ? (_a = navigator.userAgentData) === null || _a === void 0 ? void 0 : _a.brands
        : undefined;
    const result = bowser_1.default.getParser(window.navigator.userAgent);
    const browser = userAgentDataBrands
        ? userAgentDataBrands[userAgentDataBrands.length - 1].brand
        : result.parsedResult.browser.name;
    const os = result.parsedResult.os.name;
    const platform = result.parsedResult.platform.type;
    return { browser, os, platform };
};
exports.default = {
    getDeviceData
};
