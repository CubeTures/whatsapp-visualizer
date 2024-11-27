import type { Bundle } from "$lib/interfaces/structs";
import { onMount } from "svelte";
import { bundleState } from "./state.svelte";
import chat from "$lib/data/RealChatExport.json";

export default function useBundle() {
	if (bundleState.bundle === undefined) {
		onMount(() => {
			bundleState.bundle = chat as Bundle;
		});
	}

	return bundleState.bundle;
}
