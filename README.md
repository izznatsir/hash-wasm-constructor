# Hash Wasm Constructor

Derived from [hash-wasm](https://github.com/Daninet/hash-wasm) package to accomodate usage in Cloudflare Workerd runtime. The key difference is that WebAssembly binary is not inlined. Instead, it must be provided as argument to the hasher. Either in the form of `WebAssembly.Instance` or `WebAssembly.Module`.
