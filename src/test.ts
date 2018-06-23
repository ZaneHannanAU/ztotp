import { getTOTP } from './ztotp'

const sha512key = Buffer.allocUnsafe(64).fill('1234567890')
const testKeys:{sha1: Buffer; sha256: Buffer; sha512: Buffer; [key: string]: Buffer} = {
	sha1: sha512key.slice(0, 20),
	sha256: sha512key.slice(0, 32),
	sha512: sha512key.slice(0, 64)
}

const testExpect:{[alg: string]: {[unixtime: number]: number}} = {
	sha1: {
		'59': 94_287_082,
		'1111111109': 7_081_804,
		'1111111111': 14_050_471,
		'1234567890': 89_005_924,
		'2000000000': 69_279_037,
		'20000000000': 65_353_130
	},
	sha256: {
		'59': 46_119_246,
		'1111111109': 68_084_774,
		'1111111111': 67_062_674,
		'1234567890': 91_819_424,
		'2000000000': 90_698_825,
		'20000000000': 77_737_706
	},
	sha512: {
		'59': 90_693_936,
		'1111111109': 25_091_201,
		'1111111111': 99_943_326,
		'1234567890': 93_441_116,
		'2000000000': 38_618_901,
		'20000000000': 47_863_826
	}
}

for (const alg in testExpect) {
	console.log(
		'testing TOTP using %s, using secret of %d byte length (%s)\n  <0x%s>',
		alg,
		testKeys[alg].byteLength,
		testKeys[alg].toString('ascii'),
		testKeys[alg].toString('hex')
	)
	for (const unixtime in testExpect[alg]) {
		const expected = testExpect[alg][unixtime]
		const datetime = +unixtime * 1_000
		const totp = getTOTP(testKeys[alg], datetime, 8, alg)

		console.assert(
			totp === expected,
			`expected ${expected} (${expected.toString(16)}), recieved ${totp} (${totp.toString(16)}).`
		)
		if (totp === expected) console.log(
			'  test passed: getTOTP(testKeys.%s, %d /*%s*/, %d, %s) === %d \u2705',
			alg,
			datetime,
			new Date(datetime).toUTCString(),
			8,
			alg,
			expected
		)
	}
}

