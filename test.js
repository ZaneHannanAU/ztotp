const totp = require('./ztotp');
const util = require('util');
console.dir(totp, {colors: true})

const test_keys = (()=>{
	const seed = Buffer.allocUnsafe(64).fill('1234567890')
	return {
		sha1: seed.slice(0,20),
		sha256: seed.slice(0,32),
		sha512: seed
	};
})();

console.log('test secrets are:');
for (const a in test_keys)
	console.log(
		'  %s%s\n   (0x%s)',
		(a+':').padEnd(8),
		test_keys[a],
		test_keys[a].toString('hex')
	);
;

const test_expect = {
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

const ctx = {
	[util.inspect.custom](d,o) {
		const eq = this.otp === this.exp ? 'string' : 'regexp'
		const D = new Date(this.d)
		return o.stylize(`ztotp(test_keys.${(this.alg+',').padEnd(7)} ${this.d.toString().padStart(14)} /*${D.toUTCString()}*/, 8, ${JSON.stringify(this.alg).padStart(8)}) === ${this.otp};// expected ${this.exp}`, eq)
	},
	create(d, alg, otp, exp, len = 8) {
		const CTX = Object.create(ctx);
		CTX.d = d;
		CTX.alg = alg;
		CTX.otp = otp;
		CTX.exp = exp;
		CTX.len = len;
		return CTX;
	}
};

const testTOTP = (alg, time) => {
	const exp = test_expect[alg][time];
	const d = time * 1e3;
	const otp = totp.get(test_keys[alg], d, 8, alg)
	
	console.dir(
		ctx.create(d,alg,otp,exp),
		{colors:true,customInspect:true}
	);
	console.assert(
		otp === exp,
		`expected ${exp} (${exp.toString(16).padStart(8,'0')}), got ${otp} (${otp.toString(16).padStart(8,'0')})`
	);
}

for (const alg in test_expect)
	for (const time in test_expect[alg])
		testTOTP(alg, Number.parseInt(time, 10))
