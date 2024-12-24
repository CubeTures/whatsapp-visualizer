import { Bundle } from "@/lib/structures";
import React from "react";
import { useWasm } from "@/hooks/useWasm";
import "@/lib/wasm.d.ts";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import Popup from "./popup";
import { useBundleStatus } from "@/hooks/useBundleStatus";

interface Props {
	setData: React.Dispatch<React.SetStateAction<Bundle | undefined>>;
}

function Loader({ setData }: Props) {
	const bundleStatus = useBundleStatus();
	const wasmLoaded = useWasm();

	function process(text: string | ArrayBuffer) {
		new Promise((resolve) => {
			window.BundleStatus = "Sending Chat Data";
			console.log("Sending data");
			const res = window.BundleFile(text);
			return resolve(res);
		}).then((bundle) => {
			console.log("Received Bundled Data");
			window.BundleStatus = "Received Bundled Data";
			setData(JSON.parse(bundle as string) as Bundle);
		});
	}

	async function onInput(event: React.ChangeEvent<HTMLInputElement>) {
		if (event.target.files && event.target.files[0]) {
			const reader = new FileReader();

			reader.onload = (e) => {
				if (e.target && e.target.result) {
					process(e.target.result);
				} else {
					console.error("Error in reading file");
				}
			};

			console.log("Reading Data");
			window.BundleStatus = "Reading Data";
			reader.readAsText(event.target.files[0]);
		} else {
			console.error("No file selected");
		}
	}

	return (
		<div className="self-center flex flex-col gap-4">
			<h1 className="rounded border border-primary p-6 text-5xl text-primary font-semibold flex gap-6">
				WhatsApp Visualizer
			</h1>
			<Popup
				trigger={<Button>Guide</Button>}
				title="How to Export"
				desc="How to export a WhatsApp Chat">
				<ol className="list-decimal list-inside">
					<li>Open WhatsApp on your device</li>
					<li>Open the chat you'd like to export</li>
					<li>Click the three dots in the top right</li>
					<li>Click "more" from the dropdown menu</li>
					<li>Click export chat</li>
					<li>Click without media</li>
					<li>
						(Optional) Send the file to your computer before using
						this website to better see the graphs and tables
					</li>
				</ol>
			</Popup>

			<div className="self-center">
				{wasmLoaded ? (
					<Input
						id="inputFile"
						type="file"
						onChange={(event) => onInput(event)}
						accept=".txt"
						multiple={false}
						className="border-primary text-primary"
					/>
				) : (
					<div>Loading Backend...</div>
				)}
			</div>

			{bundleStatus && <p>Status: {bundleStatus}</p>}
		</div>
	);
}

export default Loader;
