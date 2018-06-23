import { createHmac } from 'crypto'

export const ms = 1_000
export const _31 = Math.pow(2, 31) - 1

export const fullVerifiableRange:Int8Array = Int8Array.of(0, -1, -2, -3, -4, -5, -6, -7, -8, -9, -10, -11, -12, -13, -14, -15)
export const getVerifiableRange = (r:number) => new Int8Array(fullVerifiableRange.buffer, fullVerifiableRange.byteOffset, r + 1)
export const verifiableRange:number[] | Int8Array = getVerifiableRange(2)
export function padStart(s:string, len:number, w:string = ' ') {
	while (s.length < len)
		s = w + s
	return s
}

export const truncate:Uint32Array = Uint32Array.of(
	1,
	10,
	100,
	1_000,
	10_000,
	100_000,
	1_000_000,
	10_000_000,
	100_000_000,
	1_000_000_000
)

export const readOut = (b:Buffer)=>b.readInt32BE(b[b.length-1]&15)&_31
// same as before just no logging

/**
 * @func getTOTP
 * @arg {buffer} secret binary key (required).
 * @arg {number} date time in milliseconds (optional, default `Date.now()`).
 * @arg {number} length of value to generate (optional, default `6`).
 * @arg {string} algorithm to digest with (optional, default `'sha1'`).
 * @arg {number} T0 as time offset in seconds (optional, default `0`).
 * @arg {number} TI as time increment in seconds (optional, default `30`).
 * @returns {number} signed positive 32 bit integer.
 *
 */
export function getTOTP(
	secret:Buffer,
	date:number = Date.now(),
	length = 6,
	algorithm:string = 'sha1',
	T0:number = 0,
	TI:number = 30
):number {
	const TC:string = padStart(
		Math.floor((date - T0 * ms) / (ms * TI)).toString(16),
		16,
		'0'
	)

	const TOTP:number = readOut(
		createHmac(algorithm, secret)
		.update(Buffer.from(TC, 'hex'))
		.digest()
	)
	
	const TOTPValue = TOTP % truncate[length]
	return TOTPValue
}


export const getTOTPShort = (s:Buffer, len:number, alg:string) => getTOTP(s, undefined, len, alg)
export const getTOTPString = (s:Buffer, len:number, alg:string) => padStart(String(getTOTPShort(s, len, alg)), len, '0')
//.padStart(len, '0')

export function verifyTOTP (
	input: number | string,
	secret:Buffer,
	range:number[] | number | Int8Array = verifiableRange,
	date:number = Date.now(),
	len:number = 6,
	alg:string = 'sha1',
	T0:number = 0,
	TI:number = 30
):boolean {
	const value:number = 'number' !== typeof input
		? parseInt(input.replace(/\D+/g, ''), 10)
		: Math.floor(input) === input ? input : -1

	const verifiable:number[] | Int8Array = 'number' === typeof range
		? getVerifiableRange(range)
		: range

	const get = (T_:number):number => getTOTP(
		secret,
		date,
		len,
		alg,
		T_,
		TI
	)
	let matched = 0
	for (const diff of verifiable)
		if (get(T0 + diff * TI) === value)
			matched++

	return !!matched
}
export {
	verifyTOTP as isValid,
	verifyTOTP as validate,
	verifyTOTP as getValidity
}

export * from './totp-uri'

