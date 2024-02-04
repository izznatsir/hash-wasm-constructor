interface CreateHasherArgs {
	/**
	 * Hasher WebAssembly instance or module.
	 */
	binary: WebAssembly.Instance | WebAssembly.Module;
	/**
	 * Hash length in bytes.
	 */
	length: number;
	/**
	 * Initial hasher memory size in bytes.
	 */
	initialMemorySize?: number;
}

interface HasherWasmExports {
	Hash_GetBuffer(): number;
	Hash_SetMemorySize(size: number): number;
	memory: {
		buffer: Uint8Array;
	};
}

async function createHasher({
	binary,
	length,
	initialMemorySize,
}: CreateHasherArgs) {
	let instance =
		binary instanceof WebAssembly.Instance
			? binary
			: await WebAssembly.instantiate(binary);
	let exports = instance.exports as unknown as HasherWasmExports;

	let memory: Uint8Array;

	setMemory(initialMemorySize);

	// TODO: Implement get_state_size
	function get_state_size() {}

	// TODO: Implement is_data_short
	function is_data_short() {}

	// TODO: Implement update_memory
	function update_memory() {}

	function getExports() {
		return exports;
	}

	function getMemory() {
		return memory;
	}

	function setMemory(size?: number) {
		if (size !== undefined) exports.Hash_SetMemorySize(size);

		let offset = exports.Hash_GetBuffer();
		let buffer = exports.memory.buffer;

		memory = new Uint8Array(buffer, offset, size);
	}

	function writeMemory(buffer: Uint8Array, offset?: number) {
		memory.set(buffer, offset);
	}

	// TODO: Implement init
	function init() {}

	// TODO: Implement update
	function update() {}

	// TODO: Implement digest
	function digest() {}

	// TODO: Implement save
	function save() {}

	// TODO: Implement load
	function load() {}

	// TODO: Implement calculate
	function calculate() {}

	return {
		calculate,
		digest,
		getExports,
		getMemory,
		length,
		init,
		load,
		save,
		setMemory,
		update,
		writeMemory,
	};
}

export { createHasher };
