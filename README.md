# ztotp

zeen3's TOTP solution.

## Usage:

```javascript
const {getTOTP, getTOTPShort, verifyTOTP, toOTPAuthURI} = require('ztotp');
```

### `ztotp.getTOTP(secret[, datems[, len[, alg[, T0[, TI]]]]])`

### `ztotp.getTOTPShort(secret[, len[, alg]])`

* `secret`: `<Buffer>` | `<TypedArray>` | `<DataView>` Must be supplied. Can be a string but should not be.
* `datems`: `<number>` Defaults to `Date.now()` (current)
* `len`: `<number>` Defaults to `6` (GAuth default/only)
* `alg`: `<string>` Defaults to `sha1` (GAuth default/only)
* `T0`: `<number>` Defaults to `0` (GAuth default/only). Value to remove from `datems / 1000`.
* `TI`: `<number>` Defaults to `30` (GAuth default/only). Interval between generation of a new TOTP code.

Syncronously generate a TOTP with Hmac key `secret` and algorithm `alg`.Read out the digest value and truncate to maximum length of `len`.

```javascript
getTOTP(Buffer.allocUnsafe(20).fill('1234567890'), 59e3, 8, 'sha1') === 94287082 // true, see test.
```

### `ztotp.verifyTOTP(input, secret[, range[, datems[, len[, alg[, T0[, TI]]]]]])`

* `input`: `<string>` | `<number>`
* `secret`: `<Buffer>` | `<TypedArray>` | `<DataView>`
* `range`: `<number[]>` | `<number>` Defaults to `[-0, -1, -2]`. Default is equivalent to `2`.
* ... same as above.

### `ztotp.toOTPAuthURI(options)`

Generates an OTPAuth TOTP URI with the given options.

* `options`: `<Object>`
	* `secret` | `key`: `<Buffer>` | `<TypedArray>` | `<DataView>` | `<string>`
	* `keyEnc`: `<string>` | `null` Default `null`
	* `name` | `account`: `<string>` User name/account name in the service
	* `service` | `issuer`: `<string>` Service name/issuer name
	* `length` | `len` | `digits`: `<number>` Maximum length of generated OTP code. Default `6`.
	* `digest` | `alg` | `algorithm`: `<string>` digest algorithm. Default `'sha1'`.
	* `init` | `epoch` | `T0`: `<number>` Initial offset. Default `0`.
	* `steps` | `TI` | `period`: `<number>` Password generation interval. Default `30`.

## Test output

	{ getTOTP: [Function: getTOTP],
	  getTOTPShort: [Function: getTOTPShort],
	  get: [Function: getN],
	  getTOTPString: [Function: getTOTPString],
	  verifyTOTP: [Function: verifyTOTP],
	  getValidity: [Function: verifyTOTP],
	  validate: [Function: verifyTOTP],
	  isValid: [Function: verifyTOTP],
	  uri: 
	   { [Function: toURI]
	     toURILong: [Function: toURILong],
	     encSecret: [Function: encSecret],
	     baseURI: 'otpauth://totp/' },
	  toURI: 
	   { [Function: toURI]
	     toURILong: [Function: toURILong],
	     encSecret: [Function: encSecret],
	     baseURI: 'otpauth://totp/' },
	  toOTPAuthURI: 
	   { [Function: toURI]
	     toURILong: [Function: toURILong],
	     encSecret: [Function: encSecret],
	     baseURI: 'otpauth://totp/' },
	  readOut: [Function],
	  verifiableRanges: 
	   [ [ -0 ],
	     [ -0, -1 ],
	     [ -0, -1, -2 ],
	     [ -0, -1, -2, -3 ],
	     [ -0, -1, -2, -3, -4 ],
	     [ -0, -1, -2, -3, -4, -5 ],
	     [ -0, -1, -2, -3, -4, -5, -6 ],
	     [ -0, -1, -2, -3, -4, -5, -6, -7 ],
	     [ -0, -1, -2, -3, -4, -5, -6, -7, -8 ],
	     [ -0, -1, -2, -3, -4, -5, -6, -7, -8, -9 ],
	     [ -0, -1, -2, -3, -4, -5, -6, -7, -8, -9, -10 ],
	     [ -0, -1, -2, -3, -4, -5, -6, -7, -8, -9, -10, -11 ],
	     [ -0, -1, -2, -3, -4, -5, -6, -7, -8, -9, -10, -11, -12 ] ],
	  verifiableRange: [ -0, -1, -2 ],
	  ms: 1000,
	  _31: 2147483647,
	  truncate: 
	   [ 1,
	     10,
	     100,
	     1000,
	     10000,
	     100000,
	     1000000,
	     10000000,
	     100000000,
	     1000000000,
	     10000000000,
	     100000000000 ] }
	test secrets are:
	  sha1:   12345678901234567890
	   (0x3132333435363738393031323334353637383930)
	  sha256: 12345678901234567890123456789012
	   (0x3132333435363738393031323334353637383930313233343536373839303132)
	  sha512: 1234567890123456789012345678901234567890123456789012345678901234
	   (0x31323334353637383930313233343536373839303132333435363738393031323334353637383930313233343536373839303132333435363738393031323334)
	ztotp(test_keys.sha1,            59000 /*Thu, 01 Jan 1970 00:00:59 GMT*/, 8,   "sha1") === 94287082;// expected 94287082
	ztotp(test_keys.sha1,    1111111109000 /*Fri, 18 Mar 2005 01:58:29 GMT*/, 8,   "sha1") === 7081804;// expected 7081804
	ztotp(test_keys.sha1,    1111111111000 /*Fri, 18 Mar 2005 01:58:31 GMT*/, 8,   "sha1") === 14050471;// expected 14050471
	ztotp(test_keys.sha1,    1234567890000 /*Fri, 13 Feb 2009 23:31:30 GMT*/, 8,   "sha1") === 89005924;// expected 89005924
	ztotp(test_keys.sha1,    2000000000000 /*Wed, 18 May 2033 03:33:20 GMT*/, 8,   "sha1") === 69279037;// expected 69279037
	ztotp(test_keys.sha1,   20000000000000 /*Tue, 11 Oct 2603 11:33:20 GMT*/, 8,   "sha1") === 65353130;// expected 65353130
	ztotp(test_keys.sha256,          59000 /*Thu, 01 Jan 1970 00:00:59 GMT*/, 8, "sha256") === 46119246;// expected 46119246
	ztotp(test_keys.sha256,  1111111109000 /*Fri, 18 Mar 2005 01:58:29 GMT*/, 8, "sha256") === 68084774;// expected 68084774
	ztotp(test_keys.sha256,  1111111111000 /*Fri, 18 Mar 2005 01:58:31 GMT*/, 8, "sha256") === 67062674;// expected 67062674
	ztotp(test_keys.sha256,  1234567890000 /*Fri, 13 Feb 2009 23:31:30 GMT*/, 8, "sha256") === 91819424;// expected 91819424
	ztotp(test_keys.sha256,  2000000000000 /*Wed, 18 May 2033 03:33:20 GMT*/, 8, "sha256") === 90698825;// expected 90698825
	ztotp(test_keys.sha256, 20000000000000 /*Tue, 11 Oct 2603 11:33:20 GMT*/, 8, "sha256") === 77737706;// expected 77737706
	ztotp(test_keys.sha512,          59000 /*Thu, 01 Jan 1970 00:00:59 GMT*/, 8, "sha512") === 90693936;// expected 90693936
	ztotp(test_keys.sha512,  1111111109000 /*Fri, 18 Mar 2005 01:58:29 GMT*/, 8, "sha512") === 25091201;// expected 25091201
	ztotp(test_keys.sha512,  1111111111000 /*Fri, 18 Mar 2005 01:58:31 GMT*/, 8, "sha512") === 99943326;// expected 99943326
	ztotp(test_keys.sha512,  1234567890000 /*Fri, 13 Feb 2009 23:31:30 GMT*/, 8, "sha512") === 93441116;// expected 93441116
	ztotp(test_keys.sha512,  2000000000000 /*Wed, 18 May 2033 03:33:20 GMT*/, 8, "sha512") === 38618901;// expected 38618901
	ztotp(test_keys.sha512, 20000000000000 /*Tue, 11 Oct 2603 11:33:20 GMT*/, 8, "sha512") === 47863826;// expected 47863826


---

