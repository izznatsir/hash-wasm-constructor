interface Argon2ConstructorArgs {
	wasm: {
		argon2: WebAssembly.Instance | WebAssembly.Module;
		blak2b: WebAssembly.Instance | WebAssembly.Module;
	};
}

class Argon2 {
	#argon2_wasm: PromiseLike<WebAssembly.Instance>;
	#blak2b_wasm: PromiseLike<WebAssembly.Instance>;

	constructor({ wasm }: Argon2ConstructorArgs) {
		if (wasm.argon2 instanceof WebAssembly.Instance) {
			this.#argon2_wasm = Promise.resolve(wasm.argon2);
		} else {
			this.#argon2_wasm = WebAssembly.instantiate(wasm.argon2);
		}

		if (wasm.blak2b instanceof WebAssembly.Instance) {
			this.#blak2b_wasm = Promise.resolve(wasm.blak2b);
		} else {
			this.#blak2b_wasm = WebAssembly.instantiate(wasm.blak2b);
		}
	}
}

export { Argon2 };
export type { Argon2ConstructorArgs };
