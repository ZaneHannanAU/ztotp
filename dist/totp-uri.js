"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const url_1 = require("url");
const buf_b32_1 = require("buf-b32");
const baseURI = 'otpauth://totp/';
exports.baseURI = baseURI;
let warning_alg = 0, warning_epo = 0, warning_dig = 0, warning_per = 0;
const encSecret = (buf) => buf_b32_1.encode(buf, true)
    .replace(/=+/g, '');
exports.encSecret = encSecret;
function toURILong(key, keyEnc = 'buffer', acc = 'ERRACCOUTNAMEGOESHERE', iss = 'ERRSERVICEISSUERGOESHERE', len = 6, alg = 'sha1', T0 = 0, TI = 30) {
    const uri = new url_1.URL(baseURI + acc + ':' + iss), sp = uri.searchParams;
    switch (keyEnc) {
        case 'buffer':
            sp.set('secret', Buffer.isBuffer(key)
                ? encSecret(key)
                : 'string' === typeof key
                    ? key
                    : encSecret(key));
            break;
        case 'string':
        case 'base32':
        default:
            sp.set('secret', String(key));
            break;
    }
    sp.set('issuer', iss);
    sp.set('account', acc);
    sp.set('algorithm', alg.toUpperCase());
    if (alg.toUpperCase() !== 'SHA1' && !warning_alg++)
        process.emitWarning('[ztotp/totp-uri] Algorithms other than SHA1 may not be used by Google Authenticator; ensure your user has a working method and/or options to set algorithm.');
    sp.set('epoch', String(T0));
    if (T0 !== 0 && !warning_epo++)
        process.emitWarning('[ztotp/totp-uri] An epoch other than 0 is mostly unsupported; ensure your user has a working method and/or options to change epoch.');
    sp.set('period', String(TI));
    if (TI !== 30 && !warning_per++)
        process.emitWarning('[ztotp/totp-uri] Intervals other than 30 may not be used by Google Authenticator; ensure your user has a working method and/or options to set interval.');
    sp.set('digits', String(len));
    if (len !== 6 && !warning_dig++)
        process.emitWarning('[ztotp/totp-uri] Lengths other than 6 may not be used by Google Authenticator; ensure your user has a working method and/or options to set length.');
    return uri.toString();
}
exports.toURILong = toURILong;
exports.toOTPAuthURILong = toURILong;
const toURI = ({ secret, secretEnc = 'string' === typeof secret ? 'string' : 'buffer', name = 'ERRACCOUNTNAMEGOESHERE', issuer = 'ERRSERVICEISSUERGOESHERE', length = 6, digits = length, len = digits, algorithm = 'sha1', digest = algorithm, alg = digest, epoch = 0, init = epoch, T0 = init, period = 30, steps = period, TI = steps }) => toURILong(secret, secretEnc, name, issuer, len, alg, T0, TI);
exports.toURI = toURI;
exports.toOTPAuthURI = toURI;
exports.default = toURI;
//# sourceMappingURL=totp-uri.js.map