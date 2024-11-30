<script lang="ts">
	import * as Card from "$lib/components/ui/card/index";

	import type { StackedDataPoint } from "$lib/interfaces/interfaces";
	import StackedBars from "./stackedBars.svelte";

	export interface Props {
		title: string;
		subtitle: string;
		footer: string;
		data: StackedDataPoint[];
		metric: string;
	}

	const { title, subtitle, footer, data, metric }: Props = $props();

	const getX = (d: StackedDataPoint): number => {
		return d.index;
	};

	const getYs = Array.from(
		{ length: 6 },
		(_, i) => (d: StackedDataPoint) => d.values[i]
	);

	const getValues = (d: StackedDataPoint): number[] => {
		return d.values;
	};

	const getLabel = (d: StackedDataPoint): string => {
		return `<span>${d.label}</br>${d.values}</span>`;
	};
</script>

<!-- TODO: Show legend -->
<Card.Root>
	<Card.Header>
		<Card.Title>{title}</Card.Title>
		<Card.Description>{subtitle}</Card.Description>
	</Card.Header>
	<Card.Content>
		<StackedBars
			{data}
			{getX}
			{getYs}
			{getValues}
			{getLabel}
		/>
	</Card.Content>
	<Card.Footer>
		<p>{@html footer}</p>
	</Card.Footer>
</Card.Root>
