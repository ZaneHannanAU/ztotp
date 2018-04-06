const crypto = require('crypto')
const testing = String(process.env.ENVIRONMENT).toLowerCase().startsWith('test')

const verifiableRanges = Array.from({length:13},($,d)=>Array.from({length:d+1},(_,i)=>-i))
const ms = 1e3;
const _31 = Math.pow(2,31)-1;
const truncate = Array.from({length: 12}, (_,i)=>Math.pow(10,i));
// shorthand to fill crap

/**
 * @func readInt32
 * @arg {buffer} b to read four bytes from
 */
const readOut = (()=>{
	/**
	 * @note - Enabling testing (ENVIRONMENT=test) makes this module dump buffers to the standard output. Don't allow this in production.
	 */
	if (testing) {
		const {inspect} = require('util');
		return b => {
			const rb = b[b.length - 1] & 15;
			const rv = b.readInt32BE(rb) & _31;
			console.log(
				'Read %s.\nReturning from byte %s: 0x%s (%i)',
				inspect(b),
				rb.toString(10).padStart(2),
				rv.toString(16).padStart(8,'0'),
				rv
			);
			return rv;
		};
	} else return b=>b.readInt32BE(b[b.length-1]&15)&_31;
	// same as above just concatenated
})();

/**
 * @func getTOTP
 * @arg {buffer} secret - binary secret key
 * @arg {number} d - unix time in milliseconds to generate from (default `Date.now()`)
 * @arg {number} len - length of value to generate  (default `6`)
 * @arg {string} alg - digest algorithm (default `'sha1'`)
 * @arg {number} T0 - time offset (default `0`)
 * @arg {number} TI - time increments (default `30`)
 * @returns {number} a 32 bit signed positive integer.
 */
const getTOTP = (secret, d = Date.now(), len = 6, alg = 'sha1', T0 = 0, TI = 30) => {
	const TC = Math.floor((d - T0 * ms) / (ms * TI))
		.toString(16)
		.padStart(16, '0');

	const TOTP = readOut(
		crypto
		.createHmac(alg, secret)
		.update(TC, 'hex')
		.digest()
	);

	const TOTPValue = TOTP % truncate[len];
	return TOTPValue;
};


const getTOTPShort = (s, len, alg) => getOTP(s, undefined, len, alg);
const getTOTPString = (s, len, alg) => String(getTOTPShort(s, len, alg))
	.padStart(len,'0');

const getN = (...opt) => {
	switch (opt.length) {
		case 1: 
			if (Buffer.isBuffer(opt[0])) {
				return getOTP(opt[0]);
			} else {
				let {
					secret, s = secret,
					unixtime, d = unixtime,
					digits, length = digits, len = length,
					algorithm, digest = algorithm, alg = digest,
					init, T0 = init,
					period, steps = period, TI = steps
				} = opt[0];
				return getOTP(s, d, len, alg, T0, TI);
			};
		default: return getTOTP(...opt);
	};
};

const verifyTOTP = (input, secret, range = TOTP.verifiableRange, d = Date.now(), len = 6, alg = 'sha1', T0 = 0, TI = 30) => {
	const value = 'number' === typeof input ? input : Number.parseInt(
		input.replace(/\D+/g,''),
		10
	);
	const verifiable = Array.isArray(range)
		? range
		: verifiableRanges[range];

	const get = (T_ = T0) => getTOTP(
		secret,
		d,
		len,
		alg,
		T_,
		TI
	);

	for (const diff of verifiable)
		if (get(T0 + diff * TI) === value)
			return true;
	return false;
};

const TOTP = {
	getTOTP,
	getTOTPShort,
	get: getN,
	getTOTPString,
	verifyTOTP,
	getValidity: verifyTOTP,
	validate: verifyTOTP,
	isValid: verifyTOTP,
	uri: require('./totp-uri'),
	toURI: require('./totp-uri'),
	toOTPAuthURI: require('./totp-uri'),
	readOut,
	verifiableRanges,
	verifiableRange: verifiableRanges[2],
	ms,
	_31,
	truncate
};
module.exports = TOTP;

