/// <reference types="node" />
export declare const ms = 1000;
export declare const _31: number;
export declare const fullVerifiableRange: Int8Array;
export declare const getVerifiableRange: (r: number) => Int8Array;
export declare const verifiableRange: number[] | Int8Array;
export declare function padStart(s: string, len: number, w?: string): string;
export declare const truncate: Uint32Array;
export declare const readOut: (b: Buffer) => number;
export declare function getTOTP(secret: Buffer, date?: number, length?: number, algorithm?: string, T0?: number, TI?: number): number;
export declare const getTOTPShort: (s: Buffer, len: number, alg: string) => number;
export declare const getTOTPString: (s: Buffer, len: number, alg: string) => string;
export declare function verifyTOTP(input: number | string, secret: Buffer, range?: number[] | number | Int8Array, date?: number, len?: number, alg?: string, T0?: number, TI?: number): boolean;
export { verifyTOTP as isValid, verifyTOTP as validate, verifyTOTP as getValidity };
export * from './totp-uri';
//# sourceMappingURL=ztotp.d.ts.map