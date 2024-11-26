<script lang="ts">
	import Pie from "./pie.svelte";

	interface Props {
		data: DataPoint[];
	}

	interface DataPoint {
		value: number;
		label: string;
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
