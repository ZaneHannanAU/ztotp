import { URL } from 'url'
import { encode } from 'buf-b32'
const baseURI = 'otpauth://totp/'
let warning_alg = 0, warning_epo = 0, warning_dig = 0, warning_per = 0

export const encSecret = (buf:ArrayBufferView):string => encode(buf, true)
	.replace(/=+/g, '')

export function toURILong (
	key: ArrayBufferView | string,
	keyEnc:string = 'buffer',
	acc:string = 'ERRACCOUTNAMEGOESHERE',
	iss:string = 'ERRSERVICEISSUERGOESHERE',
	len:number = 6,
	alg:string = 'sha1',
	T0:number = 0,
	TI:number = 30
) {
	const uri = new URL(baseURI + acc + ':' + iss), sp = uri.searchParams
	switch (keyEnc) {
		case 'buffer':
			sp.set(
				'secret',
				Buffer.isBuffer(key)
				? encSecret(key)
				: 'string' === typeof key
				? key
				: encSecret(key)
			)
			break
		case 'string':
		case 'base32':
		default:
			sp.set('secret', String(key))
			break
	}
	sp.set('issuer', iss)
	sp.set('account', acc)
	sp.set('algorithm', alg.toUpperCase())
	if (alg.toUpperCase() !== 'SHA1' && !warning_alg++) process.emitWarning('[ztotp/totp-uri] Algorithms other than SHA1 may not be used by Google Authenticator; ensure your user has a working method and/or options to set algorithm.')
	sp.set('epoch', String(T0))
	if (T0 !== 0 && !warning_epo++) process.emitWarning('[ztotp/totp-uri] An epoch other than 0 is mostly unsupported; ensure your user has a working method and/or options to change epoch.')
	sp.set('period', String(TI))
	if (TI !== 30 && !warning_per++) process.emitWarning('[ztotp/totp-uri] Intervals other than 30 may not be used by Google Authenticator; ensure your user has a working method and/or options to set interval.')
	sp.set('digits', String(len))
	if (len !== 6 && !warning_dig++) process.emitWarning('[ztotp/totp-uri] Lengths other than 6 may not be used by Google Authenticator; ensure your user has a working method and/or options to set length.')
	return uri.toString()
}

interface TOTP_URI_Options {
	secret:ArrayBufferView | string;

	secretEnc?: string;
	
	name?: string;

	issuer?: string;

	length?: number;
	len?: number;
	digits?: number;

	algorithm?: string;
	digest?: string;
	alg?: string

	epoch?: number;
	init?: number;
	T0?: number;

	period?: number;
	steps?: number;
	TI?: number;
}

export const toURI = ({
	secret,
	secretEnc = 'string' === typeof secret ? 'string' : 'buffer',
	name = 'ERRACCOUNTNAMEGOESHERE',
	issuer = 'ERRSERVICEISSUERGOESHERE',
	length = 6, digits = length, len = digits,
	algorithm = 'sha1', digest = algorithm, alg = digest,
	epoch = 0, init = epoch, T0 = init,
	period = 30, steps = period, TI = steps
}:TOTP_URI_Options):string => toURILong(secret, secretEnc, name, issuer, len, alg, T0, TI)
export default toURI
