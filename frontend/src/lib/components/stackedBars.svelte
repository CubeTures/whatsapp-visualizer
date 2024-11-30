<script
	lang="ts"
	generics="T"
>
	import { VisXYContainer, VisStackedBar, VisTooltip } from "@unovis/svelte";
	import { StackedBar } from "@unovis/ts";

	export interface Props<T> {
		data: T[];
		getValues: (d: T) => number[];
		getLabel: (d: T) => string;
		getX: (d: T) => number;
		getYs: ((d: T) => number)[];
	}

	const { data, getX, getYs, getValues, getLabel }: Props<T> = $props();

	for (const d of data) {
		if (getValues(d).length !== getYs.length) {
			throw new Error("Lengths are not the same");
		}
	}

	const triggers = {
		[StackedBar.selectors.bar]: getLabel,
	};

	VisStackedBar;
</script>

<VisXYContainer {data}>
	<VisStackedBar
		x={getX}
		y={getYs}
	/>
	<VisTooltip {triggers} />
</VisXYContainer>
