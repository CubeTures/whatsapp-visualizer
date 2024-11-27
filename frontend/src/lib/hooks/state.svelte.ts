import type { Bundle } from "$lib/interfaces/structs";

export let bundleState: { bundle: Bundle | undefined } = $state({
	bundle: undefined,
});
