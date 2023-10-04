"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewSignerRequestType = exports.SupportedNetworks = exports.RelayStatus = void 0;
var RelayStatus;
(function (RelayStatus) {
    RelayStatus["MINED"] = "mined";
})(RelayStatus = exports.RelayStatus || (exports.RelayStatus = {}));
var SupportedNetworks;
(function (SupportedNetworks) {
    SupportedNetworks["POLYGON"] = "0x89";
    SupportedNetworks["MUMBAI"] = "0x13881";
    SupportedNetworks["AVALANCHE"] = "0xA86A";
    SupportedNetworks["FUJI"] = "0xA869";
    SupportedNetworks["GNOSIS"] = "0x64";
    SupportedNetworks["CHIADO"] = "0x27D8";
})(SupportedNetworks = exports.SupportedNetworks || (exports.SupportedNetworks = {}));
var NewSignerRequestType;
(function (NewSignerRequestType) {
    NewSignerRequestType["WEBAUTHN"] = "WEBAUTHN";
    NewSignerRequestType["BURNER_WALLET"] = "BURNER_WALLET";
})(NewSignerRequestType = exports.NewSignerRequestType || (exports.NewSignerRequestType = {}));
