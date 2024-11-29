<script
	lang="ts"
	generics="T"
>
	import { VisSingleContainer, VisDonut, VisTooltip } from "@unovis/svelte";
	import { Donut } from "@unovis/ts";
	import type { DonutArcDatum } from "@unovis/ts/components/donut/types";

	interface Props<T> {
		data: T[];
		getValue: (point: T) => number;
		getLabel: (point: T) => string;
		centralLabel?: string;
		centralSubLabel?: string;
	}

	const {
		data,
		getValue,
		getLabel,
		centralLabel,
		centralSubLabel,
	}: Props<T> = $props();

	const triggers = {
		[Donut.selectors.segment]: ({ data }: DonutArcDatum<T>) =>
			getLabel(data),
	};
</script>

<VisSingleContainer {data}>
	<VisDonut
		value={getValue}
		cornerRadius={6}
		padAngle={0.05}
		showBackground={false}
		arcWidth={30}
		radius={100}
		{centralLabel}
		{centralSubLabel}
	/>
	<VisTooltip {triggers} />
</VisSingleContainer>
