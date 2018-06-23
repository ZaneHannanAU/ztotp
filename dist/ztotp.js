"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
exports.ms = 1000;
exports._31 = Math.pow(2, 31) - 1;
exports.fullVerifiableRange = Int8Array.of(0, -1, -2, -3, -4, -5, -6, -7, -8, -9, -10, -11, -12, -13, -14, -15);
exports.getVerifiableRange = (r) => new Int8Array(exports.fullVerifiableRange.buffer, exports.fullVerifiableRange.byteOffset, r + 1);
exports.verifiableRange = exports.getVerifiableRange(2);
function padStart(s, len, w = ' ') {
    while (s.length < len)
        s = w + s;
    return s;
}
exports.padStart = padStart;
exports.truncate = Uint32Array.of(1, 10, 100, 1000, 10000, 100000, 1000000, 10000000, 100000000, 1000000000);
exports.readOut = (b) => b.readInt32BE(b[b.length - 1] & 15) & exports._31;
function getTOTP(secret, date = Date.now(), length = 6, algorithm = 'sha1', T0 = 0, TI = 30) {
    const TC = padStart(Math.floor((date - T0 * exports.ms) / (exports.ms * TI)).toString(16), 16, '0');
    const TOTP = exports.readOut(crypto_1.createHmac(algorithm, secret)
        .update(Buffer.from(TC, 'hex'))
        .digest());
    const TOTPValue = TOTP % exports.truncate[length];
    return TOTPValue;
}
exports.getTOTP = getTOTP;
exports.getTOTPShort = (s, len, alg) => getTOTP(s, undefined, len, alg);
exports.getTOTPString = (s, len, alg) => padStart(String(exports.getTOTPShort(s, len, alg)), len, '0');
function verifyTOTP(input, secret, range = exports.verifiableRange, date = Date.now(), len = 6, alg = 'sha1', T0 = 0, TI = 30) {
    const value = 'number' !== typeof input
        ? parseInt(input.replace(/\D+/g, ''), 10)
        : Math.floor(input) === input ? input : -1;
    const verifiable = 'number' === typeof range
        ? exports.getVerifiableRange(range)
        : range;
    const get = (T_) => getTOTP(secret, date, len, alg, T_, TI);
    let matched = 0;
    for (const diff of verifiable)
        if (get(T0 + diff * TI) === value)
            matched++;
    return !!matched;
}
exports.verifyTOTP = verifyTOTP;
exports.isValid = verifyTOTP;
exports.validate = verifyTOTP;
exports.getValidity = verifyTOTP;
__export(require("./totp-uri"));
//# sourceMappingURL=ztotp.js.map