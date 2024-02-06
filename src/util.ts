import type { Data } from "./types.js";

let text_encoder = new TextEncoder();

let BASE64_CHARS =
	"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
let BASE64_LOOKUP = new Uint8Array(256);
for (let i = 0; i < BASE64_CHARS.length; i++) {
	BASE64_LOOKUP[BASE64_CHARS.charCodeAt(i)] = i;
}

function encodeBase64({
	data,
	pad = true,
}: {
	data: Uint8Array;
	pad?: boolean;
}): string {
	let len = data.length;
	let extra_bytes = len % 3;
	let parts = [];

	let len2 = len - extra_bytes;
	for (let i = 0; i < len2; i += 3) {
		let tmp =
			((data[i] << 16) & 0xff0000) +
			((data[i + 1] << 8) & 0xff00) +
			(data[i + 2] & 0xff);

		let triplet =
			BASE64_CHARS.charAt((tmp >> 18) & 0x3f) +
			BASE64_CHARS.charAt((tmp >> 12) & 0x3f) +
			BASE64_CHARS.charAt((tmp >> 6) & 0x3f) +
			BASE64_CHARS.charAt(tmp & 0x3f);

		parts.push(triplet);
	}

	if (extra_bytes === 1) {
		let tmp = data[len - 1];
		let a = BASE64_CHARS.charAt(tmp >> 2);
		let b = BASE64_CHARS.charAt((tmp << 4) & 0x3f);

		parts.push(`${a}${b}`);
		if (pad) {
			parts.push("==");
		}
	} else if (extra_bytes === 2) {
		let tmp = (data[len - 2] << 8) + data[len - 1];
		let a = BASE64_CHARS.charAt(tmp >> 10);
		let b = BASE64_CHARS.charAt((tmp >> 4) & 0x3f);
		let c = BASE64_CHARS.charAt((tmp << 2) & 0x3f);
		parts.push(`${a}${b}${c}`);
		if (pad) {
			parts.push("=");
		}
	}

	return parts.join("");
}

function getDecodeBase64Length({ data }: { data: string }): number {
	let buffer_length = Math.floor(data.length * 0.75);
	let len = data.length;

	if (data[len - 1] === "=") {
		buffer_length -= 1;
		if (data[len - 2] === "=") {
			buffer_length -= 1;
		}
	}

	return buffer_length;
}

function decodeBase64({ data }: { data: string }): Uint8Array {
	let buffer_length = getDecodeBase64Length({ data });
	let len = data.length;

	let bytes = new Uint8Array(buffer_length);

	let p = 0;
	for (let i = 0; i < len; i += 4) {
		let encoded1 = BASE64_LOOKUP[data.charCodeAt(i)];
		let encoded2 = BASE64_LOOKUP[data.charCodeAt(i + 1)];
		let encoded3 = BASE64_LOOKUP[data.charCodeAt(i + 2)];
		let encoded4 = BASE64_LOOKUP[data.charCodeAt(i + 3)];

		bytes[p] = (encoded1 << 2) | (encoded2 >> 4);
		p += 1;
		bytes[p] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
		p += 1;
		bytes[p] = ((encoded3 & 3) << 6) | (encoded4 & 63);
		p += 1;
	}

	return bytes;
}

let alpha = "a".charCodeAt(0) - 10;
let digit = "0".charCodeAt(0);

function getDigestHex({
	chars,
	input,
	length,
}: {
	chars: Array<number>;
	input: Uint8Array;
	length: number;
}) {
	let p = 0;

	for (let i = 0; i < length; i++) {
		let nibble = input[i] >>> 4;
		chars[p++] = nibble > 9 ? nibble + alpha : nibble + digit;
		nibble = input[i] & 0xf;
		chars[p++] = nibble > 9 ? nibble + alpha : nibble + digit;
	}

	return String.fromCharCode.apply(null, chars);
}

function getUint8Buffer(data: Data) {
	if (typeof data === "string") {
		return text_encoder.encode(data);
	}

	if (ArrayBuffer.isView(data)) {
		return new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
	}

	throw new Error("Invalid data type.");
}

function hexStringEqualUint8({
	buffer,
	hex,
}: {
	buffer: Uint8Array;
	hex: string;
}) {
	if (hex.length !== buffer.length * 2) {
		return false;
	}

	for (let i = 0; i < buffer.length; i++) {
		let hex_index = i << 1;

		if (
			buffer[i] !==
			hex_char_codes_to_int(
				hex.charCodeAt(hex_index),
				hex.charCodeAt(hex_index + 1),
			)
		) {
			return false;
		}
	}

	return true;
}

function hex_char_codes_to_int(a: number, b: number) {
	return (
		(((a & 0xf) + ((a >> 6) | ((a >> 3) & 0x8))) << 4) |
		((b & 0xf) + ((b >> 6) | ((b >> 3) & 0x8)))
	);
}

function writeHexToUint8({ buffer, hex }: { buffer: Uint8Array; hex: string }) {
	let size = hex.length >> 1;

	for (let i = 0; i < size; i++) {
		let hex_index = i << 1;

		buffer[i] = hex_char_codes_to_int(
			hex.charCodeAt(hex_index),
			hex.charCodeAt(hex_index + 1),
		);
	}
}

export {
	decodeBase64,
	encodeBase64,
	getDecodeBase64Length,
	getDigestHex,
	getUint8Buffer,
	hexStringEqualUint8,
	writeHexToUint8,
};
