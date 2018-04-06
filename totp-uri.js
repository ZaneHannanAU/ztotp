const {URL} = require('url')
const baseURI = 'otpauth://totp/'

const {encode} = require('buf-b32');

const encSecret = buf => {
	const b32 = encode(buf);
	const str = b32.toString('ascii').replace(/=+/g,'');
	return str;
};

const toURI = ({
	secret, key = secret, keyEnc = null,
	name = 'ERRACCOUNTNAMEGOESHERE', account = name,
	service = 'ERRSERVICEISSUERGOESHERE', issuer = service,
	length = 6, len = length, digits = len,
	digest = 'sha1', alg = digest, algorithm,
	init = 0, epoch = init, T0 = epoch,
	steps = 30, TI = steps, period = TI
}) => toURILong(key, keyEnc, account, issuer, digits, algorithm, T0, period)

const toURILong = (key, keyEnc, acc, iss, len, alg, T0, TI) => {
	const uri = new URL(
		String.raw`${
			acc.replace(/[\/:]/g,'')
		}:${
			iss.replace(/[\/:]/g,'')
		}`,
		baseURI
	),
		sp = uri.searchParams
	;;

	switch (keyEnc) {
		default: key = Buffer.from(key, keyEnc);
		case null:
		case 'bin':
			sp.set(
				'secret',
				Buffer.isBuffer(key)
				? encSecret(buf)
				: key
			);
			break;
		case 'base32':
			sp.set('secret',String(key));
			break;
	};
	sp.set('issuer', String(iss));
	sp.set('account', String(acc));
	sp.set('algorithm', String(alg).toUpperCase());
	sp.set('period', String(period));
	return uri.toString();
};

module.exports = toURI;
module.exports.toURILong = toURILong;
module.exports.encSecret = encSecret;
module.exports.baseURI = baseURI;

