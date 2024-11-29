<script lang="ts">
	import type { DataPoint } from "$lib/interfaces/props";
	import { insertCommas } from "$lib/scripts/helpers";
	import Pie from "./pie.svelte";

	interface Props {
		data: DataPoint[];
		metric: string;
		centralLabel?: string;
		centralSubLabel?: string;
	}

	const { data, metric, centralLabel, centralSubLabel }: Props = $props();
	const getValue = (d: DataPoint) => d.value;
	const getLabel = (d: DataPoint) =>
		`<span><strong>${d.label}</strong></br>${insertCommas(d.value)} ${metric}</span>`;
</script>

<Pie
	{data}
	{getValue}
	{getLabel}
	{centralLabel}
	{centralSubLabel}
/>
