const crypto = require('crypto')
const testing = String(process.env.ENVIRONMENT).toLowerCase().startsWith('test')

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
	const TC = Math.floor((Math.floor(d / 1e3) - T0) / TI)
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

const verifyTOTP = (input, secret, d = Date.now(), len = 6, alg = 'sha1', T0 = 0, TI = 30) => {
	const value = Number.parseInt(
		input.replace(/[,\._ -]/g,''),
		10
	);
	const get = (T_ = T0) => getTOTP(
		secret,
		d,
		len,
		alg,
		T_,
		TI
	);

	switch (value) {
		case get(T0):
			return true;
		case get(T0-TI):
			return true;
		case get(T0+TI):
			return true;
		case get(T0-2*TI):
			return true;
		case get(T0+2*TI):
			return true;
		default: return false;
	};
};

const getTOTPString = (s, len, alg) => String(
	getOTP(s, undefined, undefined, undefined, len, alg)
).padStart(len,'0');

const TOTP = {
	getTOTP,
	get: getTOTP,
	getTOTPString,
	verifyTOTP,
	getValidity: verifyTOTP,
	readOut,
	_31,
	truncate
};
module.exports = TOTP;

