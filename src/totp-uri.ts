import { URL } from 'url'
import { encode } from 'buf-b32'
const baseURI = 'otpauth://totp/'

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
	const uri = new URL(acc + ':' + iss, baseURI), sp = uri.searchParams
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
	sp.set('epoch', String(T0))
	sp.set('period', String(TI))
	sp.set('digits', String(len))
	return uri.toString()
}

interface TOTP_URI_Options {
	secret:ArrayBufferView | string;
	key:ArrayBufferView | string;

	secretEnc: string;
	keyEnc: string;
	
	name: string;
	account: string;

	service: string;
	issuer: string;

	length: number;
	len: number;
	digits: number;

	algorithm: string;
	digest: string;
	alg: string

	epoch: number;
	init: number;
	T0: number;

	period: number;
	steps: number;
	TI: number;
}

export const toURI = ({
	secret, key = secret,
	secretEnc = 'string' === typeof key ? 'string' : 'buffer',
		keyEnc = secretEnc,
	name = 'ERRACCOUNTNAMEGOESHERE', account = name,
	service = 'ERRSERVICEISSUERGOESHERE', issuer = service,
	length = 6, digits = length, len = digits,
	algorithm = 'sha1', digest = algorithm, alg = digest,
	epoch = 0, init = epoch, T0 = init,
	period = 30, steps = period, TI = steps
}:TOTP_URI_Options):string => toURILong(key, keyEnc, account, issuer, len, alg, T0, TI)
export default toURI
