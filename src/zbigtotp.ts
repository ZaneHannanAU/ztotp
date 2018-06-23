// import { createHmac } from 'crypto'
// 
// export const bigMs = 1_000n
// 
// export const verifiableRanges:bigint[][] = [
// 	[0n],
// 	[0n, -1n],
// 	[0n, -1n, -2n, -3n],
// 	[0n, -1n, -2n, -3n, -4n],
// 	[0n, -1n, -2n, -3n, -4n, -5n],
// 	[0n, -1n, -2n, -3n, -4n, -5n, -6n],
// 	[0n, -1n, -2n, -3n, -4n, -5n, -6n, -7n],
// 	[0n, -1n, -2n, -3n, -4n, -5n, -6n, -7n, -8n],
// 	[0n, -1n, -2n, -3n, -4n, -5n, -6n, -7n, -8n, -9n],
// 	[0n, -1n, -2n, -3n, -4n, -5n, -6n, -7n, -8n, -9n, -10n],
// 	[0n, -1n, -2n, -3n, -4n, -5n, -6n, -7n, -8n, -9n, -10n, -11n],
// 	[0n, -1n, -2n, -3n, -4n, -5n, -6n, -7n, -8n, -9n, -10n, -11n, -12n],
// 	[0n, -1n, -2n, -3n, -4n, -5n, -6n, -7n, -8n, -9n, -10n, -11n, -12n, -13n],
// 	[0n, -1n, -2n, -3n, -4n, -5n, -6n, -7n, -8n, -9n, -10n, -11n, -12n, -13n, -14n],
// 	[0n, -1n, -2n, -3n, -4n, -5n, -6n, -7n, -8n, -9n, -10n, -11n, -12n, -13n, -14n, -15n]
// ]
// export const verifiableRange:bigint[] = verifiableRanges[2]
// 
// export const bigTruncate:BigUint64Array = BigUint64Array.of(
// 	1n,
// 	10n,
// 	100n,
// 	1_000n,
// 	10_000n,
// 	100_000n,
// 	1_000_000n,
// 	10_000_000n,
// 	100_000_000n,
// 	1_000_000_000n,
// 	10_000_000_000n,
// 	100_000_000_000n,
// 	1_000_000_000_000n,
// 	10_000_000_000_000n,
// 	100_000_000_000_000n,
// 	1_000_000_000_000_000n,
// 	10_000_000_000_000_000n,
// 	100_000_000_000_000_000n,
// 	1_000_000_000_000_000_000n,
// 	10_000_000_000_000_000_000n
// )
// // JSON.stringify(Array.from({length:20},($,n)=>Math.pow(10, n)), null, '\t').replace(/(10+)/g, nf.format).replace(/,([^\n])/g, '_$1').replace(/(0)$|(,)$/gm, '$1n$2').replace('[','BigUint64Array.of(').replace(']',')')
// 
// export const bigReadOut = (b:ArrayBufferView):bigint => {
// 	const dv = new DataView(b.buffer, b.byteOffset, b.byteLength)
// 	const offset = dv.getUint8(dv.byteLength - 1) & 15
// 	return dv.getBigUint64(offset, true)
// }
// 
// export function getBigTOTP(
// 	secret:ArrayBufferView,
// 	date:bigint = BigInt(Date.now()),
// 	length:number|bigint = 9n,
// 	algorithm:string = 'sha256',
// 	T0:bigint = 0n,
// 	TI:bigint = 30n
// ):bigint {
// 	const TC:BigInt64Array = BigInt64Array.of((date - T0 * bigMs) / (bigMs * TI))
// 
// 	const TOTP:bigint = bigReadOut(
// 		createHmac(alg, secret)
// 		.update(TC)
// 		.digest
// 	)
// 
// 	const TOTPValue = TOTP % bigTruncate[length]
// }
// 
// export const getBigTOTPShort = (s:ArrayBufferView, len:number | bigint, alg:string) => getTOTP(s, undefined, len, alg)
// 
// export const getBigTOTPString = (s:ArrayBufferView, len:number | bigint, alg:string) => String(getTOTPShort(s, len, alg))
// 	.padStart(len, '0')
// 
// export function verifyBigTOTP (
// 	input: bigint | string,
// 	secret:ArrayBufferView,
// 	range:bigint[] | number | bigint = verifiableRange,
// 	date:bigint = BigInt(Date.now()),
// 	len:bigint|number = 6,
// 	alg:string = 'sha1',
// 	T0:bigint = 0n,
// 	TI:bigint = 30n
// ):boolean {
// 	const value:bigint = 'bigint' !== typeof input
// 		? BigInt(input.replace(/\D+/g, ''), 10)
// 		: input
// 
// 	const verifiable:bigint[] = Array.isArray(range)
// 		? range
// 		: verifiableRanges[range]
// 
// 	const get = (T_:number):number => getTOTP(
// 		secret,
// 		date,
// 		len,
// 		alg,
// 		T_,
// 		TI
// 	)
// 	let matched = false
// 	for (const diff of verifiable)
// 		if (get(T0 + diff * TI) === value)
// 			matched = true
// 
// 	return matched
// }
