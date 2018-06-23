declare const baseURI = "otpauth://totp/";
declare const encSecret: (buf: ArrayBufferView) => string;
declare function toURILong(key: ArrayBufferView | string, keyEnc?: string, acc?: string, iss?: string, len?: number, alg?: string, T0?: number, TI?: number): string;
interface TOTP_URI_Options {
    secret: ArrayBufferView | string;
    secretEnc?: string;
    name?: string;
    issuer?: string;
    length?: number;
    len?: number;
    digits?: number;
    algorithm?: string;
    digest?: string;
    alg?: string;
    epoch?: number;
    init?: number;
    T0?: number;
    period?: number;
    steps?: number;
    TI?: number;
}
declare const toURI: ({ secret, secretEnc, name, issuer, length, digits, len, algorithm, digest, alg, epoch, init, T0, period, steps, TI }: TOTP_URI_Options) => string;
export default toURI;
export { toURI, toURI as toOTPAuthURI, toURILong, toURILong as toOTPAuthURILong, encSecret, baseURI, TOTP_URI_Options };
//# sourceMappingURL=totp-uri.d.ts.map