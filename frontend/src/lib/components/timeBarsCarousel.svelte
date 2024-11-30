<script lang="ts">
	import useBundle from "$lib/hooks/useBundle.svelte";
	import type {
		StackedDataPoint,
		TimesKey,
	} from "$lib/interfaces/interfaces";
	import type { Counts, Statistic } from "$lib/interfaces/structs";
	import { numberToDate } from "$lib/scripts/helpers";
	import Carousel from "./carousel.svelte";
	import CarouselItem from "./carouselItem.svelte";
	import StackedBarCard from "./stackedBarCard.svelte";

	const bundle = useBundle();

	const fields: TimesKey[] = ["hour", "weekday", "month", "year"];

	const data: StackedDataPoint[][] = $derived.by(() => {
		if (bundle.value === undefined) {
			return [];
		}

		let result: StackedDataPoint[][] = [];
		for (const field of fields) {
			result.push(getFieldProps(bundle.value.aggregate, field));
		}

		return result;
	});

	function getFieldProps(
		aggregate: Statistic,
		field: TimesKey
	): StackedDataPoint[] {
		let result: StackedDataPoint[] = [];
		if (field === "year") {
			const currentYear = new Date().getFullYear();
			for (const [year, counts] of Object.entries(
				aggregate.counts_by_time[field]
			)) {
				result.push({
					values: countsToValues(counts),
					index: parseInt(year) - currentYear,
					label: year,
				});
			}
		} else {
			const counts = aggregate.counts_by_time[field];
			for (let i = 0; i < counts.length; i++) {
				result.push({
					values: countsToValues(counts[i]),
					index: i,
					label: numberToDate(i, field),
				});
			}
		}

		return result;
	}

	function countsToValues(counts: Counts): number[] {
		let result: number[] = [];
		for (const [key, value] of Object.entries(counts)) {
			if (key !== "messages" && key !== "words" && key !== "letters") {
				result.push(value);
			}
		}

		return result;
	}

	const title = "Title";
	const subtitle = "Subtitle";
	const footer = "Footer";
	const metric = "Metric";
</script>

<!-- TODO: Include toggle group to enable or disable counts fields -->
<Carousel>
	{#each data as d}
		<CarouselItem>
			<StackedBarCard
				data={d}
				{title}
				{subtitle}
				{footer}
				{metric}
			/>
		</CarouselItem>
	{/each}
</Carousel>
