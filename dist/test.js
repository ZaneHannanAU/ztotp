"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ztotp_1 = require("./ztotp");
const sha512key = Buffer.allocUnsafe(64).fill('1234567890');
const testKeys = {
    sha1: sha512key.slice(0, 20),
    sha256: sha512key.slice(0, 32),
    sha512: sha512key.slice(0, 64)
};
const testExpect = {
    sha1: {
        '59': 94287082,
        '1111111109': 7081804,
        '1111111111': 14050471,
        '1234567890': 89005924,
        '2000000000': 69279037,
        '20000000000': 65353130
    },
    sha256: {
        '59': 46119246,
        '1111111109': 68084774,
        '1111111111': 67062674,
        '1234567890': 91819424,
        '2000000000': 90698825,
        '20000000000': 77737706
    },
    sha512: {
        '59': 90693936,
        '1111111109': 25091201,
        '1111111111': 99943326,
        '1234567890': 93441116,
        '2000000000': 38618901,
        '20000000000': 47863826
    }
};
ztotp_1.toURI({ secret: testKeys.sha256, alg: 'sha256', length: 8, period: 31, epoch: 1 });
for (const alg in testExpect) {
    console.log('testing TOTP using %s, using secret of %d byte length (%s)\n  secret as hex: <0x%s>', alg, testKeys[alg].byteLength, testKeys[alg].toString('ascii'), testKeys[alg].toString('hex'));
    for (const unixtime in testExpect[alg]) {
        const expected = testExpect[alg][unixtime];
        const datetime = +unixtime * 1000;
        const totp = ztotp_1.getTOTP(testKeys[alg], datetime, 8, alg);
        console.assert(totp === expected, `expected ${expected} (${expected.toString(16)}), recieved ${totp} (${totp.toString(16)}).`);
        if (totp === expected)
            console.log('  test passed: getTOTP(testKeys.%s, %d /*%s*/, %d, %s) === %d \u2705', alg, datetime, new Date(datetime).toUTCString(), 8, alg, expected);
    }
    console.log('URI test: %s', ztotp_1.toURI({ secret: testKeys[alg], alg: alg, length: 8 }));
}
//# sourceMappingURL=test.js.map