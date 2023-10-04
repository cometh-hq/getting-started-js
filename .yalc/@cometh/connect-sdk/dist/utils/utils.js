"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bufferToHex = exports.bufferToArrayBuffer = exports._encodeUTF8 = exports._decodeUTF8 = exports.findSequence = exports.derToRS = exports.parseHex = exports.hexArrayStr = void 0;
const hexArrayStr = (array) => new Uint8Array(array).reduce((acc, v) => acc + v.toString(16).padStart(2, '0'), '0x');
exports.hexArrayStr = hexArrayStr;
const parseHex = (str) => new Uint8Array(str.match(/[\da-f]{2}/gi).map((h) => parseInt(h, 16)));
exports.parseHex = parseHex;
const derToRS = (der) => {
    let offset = 3;
    let dataOffset;
    if (der[offset] === 0x21) {
        dataOffset = offset + 2;
    }
    else {
        dataOffset = offset + 1;
    }
    const r = der.slice(dataOffset, dataOffset + 32);
    offset = offset + der[offset] + 1 + 1;
    if (der[offset] === 0x21) {
        dataOffset = offset + 2;
    }
    else {
        dataOffset = offset + 1;
    }
    const s = der.slice(dataOffset, dataOffset + 32);
    return [r, s];
};
exports.derToRS = derToRS;
const findSequence = (arr, seq) => {
    for (let i = 0; i < arr.length; ++i) {
        for (let j = 0; j < seq.length; j++) {
            if (arr[i + j] !== seq[j]) {
                break;
            }
            if (j === seq.length - 1) {
                return i;
            }
        }
    }
    return -1;
};
exports.findSequence = findSequence;
const _decodeUTF8 = (b) => {
    return new TextDecoder().decode(b);
};
exports._decodeUTF8 = _decodeUTF8;
const _encodeUTF8 = (s) => {
    return new TextEncoder().encode(s);
};
exports._encodeUTF8 = _encodeUTF8;
const bufferToArrayBuffer = (bufferObject) => {
    const buffer = Buffer.from(bufferObject.data);
    return Uint8Array.from(buffer).buffer;
};
exports.bufferToArrayBuffer = bufferToArrayBuffer;
const bufferToHex = (s) => {
    return Buffer.from(s).toString('hex');
};
exports.bufferToHex = bufferToHex;
