<script lang="ts">
	import type { DataPoint } from "$lib/interfaces/props";
	import Pie from "./pie.svelte";

	interface Props {
		data: DataPoint[];
	}

	const { data }: Props = $props();
	const getValue = (d: DataPoint) => d.value;
	const getLabel = (d: DataPoint) => `<span>${d.label}</span>`;
</script>

<Pie
	{data}
	{getValue}
	{getLabel}
/>
