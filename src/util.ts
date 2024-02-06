import type { Data } from "./types.js";

let text_encoder = new TextEncoder();

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

	for (let byte of input) {
		let nibble = byte >>> 4;
		chars[p++] = nibble > 9 ? nibble + alpha : nibble + digit;
		nibble = byte & 0xf;
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

export { getDigestHex, getUint8Buffer, hexStringEqualUint8, writeHexToUint8 };
