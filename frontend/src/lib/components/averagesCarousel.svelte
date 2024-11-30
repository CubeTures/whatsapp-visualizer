<script lang="ts">
	import PieCard, { type Props } from "$lib/components/pieCard.svelte";
	import useBundle from "$lib/hooks/useBundle.svelte";

	import type { AveragesKey, DataPoint } from "$lib/interfaces/interfaces";
	import "$lib/styles/global.css";
	import { capitalize, insertCommas } from "$lib/scripts/helpers";
	import { getAveragesFlavor } from "$lib/scripts/flavor/countFlavor";
	import Carousel from "./carousel.svelte";
	import CarouselItem from "./carouselItem.svelte";

	const bundle = useBundle();

	const fields: AveragesKey[] = [
		"words",
		"letters",
		"emojis",
		"links",
		"media",
		"deleted",
		"edited",
	];

	const data: Props[] = $derived.by((): Props[] => {
		if (bundle.value === undefined) {
			return [];
		}

		let result: Props[] = [];
		for (const field of fields) {
			result.push(getFieldProps(field));
		}

		return result;
	});

	function getFieldProps(field: AveragesKey): Props {
		if (bundle.value === undefined) {
			throw new Error("Bundle Undefined");
		}

		const flavor = getAveragesFlavor(bundle.value.personal, field);
		const { data, sum } = getDataPoints(field);

		return {
			title: `Average ${capitalize(field)}`,
			metric: `${field} per message`,
			centralLabel: capitalize(field),
			centralSubLabel: `${insertCommas(sum)} average`,
			subtitle: flavor.description,
			footer: flavor.quip,
			data,
		};
	}

	function getDataPoints(field: AveragesKey): {
		data: DataPoint[];
		sum: number;
	} {
		if (bundle.value === undefined) {
			throw new Error("Bundle Undefined");
		}

		let data: DataPoint[] = [];
		let sum = 0;
		let total = 0;

		for (const [person, statistic] of Object.entries(
			bundle.value.personal
		)) {
			const value = statistic.counts[field] / statistic.counts.messages;
			sum += statistic.counts[field];
			total += statistic.counts.messages;

			data.push({
				value,
				label: person,
			});
		}

		return { data, sum: sum / total };
	}
</script>

<div class="flex justify-center">
	<Carousel>
		{#each data as d}
			<CarouselItem>
				<PieCard {...d} />
			</CarouselItem>
		{/each}
	</Carousel>
</div>
