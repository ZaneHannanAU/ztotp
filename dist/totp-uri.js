"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const url_1 = require("url");
const buf_b32_1 = require("buf-b32");
const baseURI = 'otpauth://totp/';
exports.encSecret = (buf) => buf_b32_1.encode(buf, true)
    .replace(/=+/g, '');
function toURILong(key, keyEnc = 'buffer', acc = 'ERRACCOUTNAMEGOESHERE', iss = 'ERRSERVICEISSUERGOESHERE', len = 6, alg = 'sha1', T0 = 0, TI = 30) {
    const uri = new url_1.URL(acc + ':' + iss, baseURI), sp = uri.searchParams;
    switch (keyEnc) {
        case 'buffer':
            sp.set('secret', Buffer.isBuffer(key)
                ? exports.encSecret(key)
                : 'string' === typeof key
                    ? key
                    : exports.encSecret(key));
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
    sp.set('epoch', String(T0));
    sp.set('period', String(TI));
    sp.set('digits', String(len));
    return uri.toString();
}
exports.toURILong = toURILong;
exports.toURI = ({ secret, key = secret, secretEnc = 'string' === typeof key ? 'string' : 'buffer', keyEnc = secretEnc, name = 'ERRACCOUNTNAMEGOESHERE', account = name, service = 'ERRSERVICEISSUERGOESHERE', issuer = service, length = 6, digits = length, len = digits, algorithm = 'sha1', digest = algorithm, alg = digest, epoch = 0, init = epoch, T0 = init, period = 30, steps = period, TI = steps }) => toURILong(key, keyEnc, account, issuer, len, alg, T0, TI);
exports.default = exports.toURI;
//# sourceMappingURL=totp-uri.js.map