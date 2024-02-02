declare module "*.wasm" {
	let content: WebAssembly.Module;
	export default content;
}

declare module "*.wasm.json" {
	let content: { name: string; hash: string };
	export default content;
}

declare module "*.wasm.txt" {
	let content: string;
	export default content;
}
