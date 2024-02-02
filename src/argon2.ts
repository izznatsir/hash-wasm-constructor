import { Hasher } from "./hasher.js";

interface Argon2ConstructorArgs {
	wasm: {
		argon2: WebAssembly.Instance | WebAssembly.Module;
		blak2b: WebAssembly.Instance | WebAssembly.Module;
	};
}

class Argon2 {
	#argon2_hasher: Hasher;
	#blak2b_hasher: Hasher;

	constructor({ wasm }: Argon2ConstructorArgs) {
		this.#argon2_hasher = new Hasher({ wasm: wasm.argon2 });
		this.#blak2b_hasher = new Hasher({ wasm: wasm.blak2b });
	}
}

export { Argon2 };
export type { Argon2ConstructorArgs };
