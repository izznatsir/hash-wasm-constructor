interface Argon2ConstructorArgs {
	wasm: {
		argon2: WebAssembly.Instance | WebAssembly.Module;
		blak2b: WebAssembly.Instance | WebAssembly.Module;
	};
}

class Argon2 {}

export { Argon2 };
export type { Argon2ConstructorArgs };
