import type { Bundle } from "$lib/interfaces/structs";
import { onMount } from "svelte";
import { bundleState } from "./state.svelte";
import chat from "$lib/data/RealChatExport.json";

const debug = false;

export default function useBundle() {
	debug && console.log("Use Bundle -- Called");
	onMount(() => {
		debug && console.log("Use Bundle -- On Mount");
		if (bundleState.bundle === undefined) {
			debug && console.log("Use Bundle -- Undefined");
			bundleState.bundle = chat as Bundle;
		}
	});

	return {
		get value() {
			return bundleState.bundle;
		},
	};
}
