interface HasherConstructorArgs {
	wasm: WebAssembly.Instance | WebAssembly.Module;
}

class Hasher {
	#wasm_promise: PromiseLike<WebAssembly.Instance>;

	blockSize = 0;

	digestSize = 0;

	hashLength = 0;

	constructor({ wasm }: HasherConstructorArgs) {
		if (wasm instanceof WebAssembly.Instance) {
			this.#wasm_promise = Promise.resolve(wasm);
		} else {
			this.#wasm_promise = WebAssembly.instantiate(wasm);
		}
	}

	calculate() {}

	digest() {}

	getExports() {}

	getMemory() {}

	init() {}

	load() {}

	save() {}

	setMemorySize() {}

	update() {}

	writeMemory() {}
}

export { Hasher };
