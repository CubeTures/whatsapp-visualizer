import { useEffect, useState } from "react";
import "@/lib/wasm_exec";

export function useWasm() {
	const [isWasmLoaded, setIsWasmLoaded] = useState(false);

	useEffect(() => {
		if (WebAssembly) {
			// WebAssembly.instantiateStreaming is not currently available in Safari
			if (WebAssembly && !WebAssembly.instantiateStreaming) {
				// polyfill
				WebAssembly.instantiateStreaming = async (
					resp,
					importObject
				) => {
					const source = await (await resp).arrayBuffer();
					return await WebAssembly.instantiate(source, importObject);
				};
			}

			const go = new Go();
			WebAssembly.instantiateStreaming(
				fetch("main.wasm"),
				go.importObject
			).then((result) => {
				go.run(result.instance);
				setIsWasmLoaded(true);
			});
		} else {
			console.log("WebAssembly is not supported in your browser");
		}
	}, []);

	return isWasmLoaded;
}
