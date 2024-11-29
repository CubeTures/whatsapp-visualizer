<script lang="ts">
	import PieCard, { type Props } from "$lib/components/pieCard.svelte";
	import useBundle from "$lib/hooks/useBundle.svelte";
	import type { DataPoint } from "$lib/interfaces/props";
	import type { Counts } from "$lib/interfaces/structs";
	import * as Carousel from "$lib/components/ui/carousel/index";
	import "$lib/styles/global.css";
	import { capitalize, insertCommas } from "$lib/scripts/helpers";
	import { getCountsFlavor } from "$lib/scripts/flavor/countFlavor";

	const bundle = useBundle();

	const fields: (keyof Counts)[] = [
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

	function getFieldProps(field: keyof Counts): Props {
		if (bundle.value === undefined) {
			throw new Error("Bundle Undefined");
		}

		const flavor = getCountsFlavor(bundle.value.personal, field);
		const { data, sum } = getDataPoints(field);

		return {
			title: capitalize(field),
			metric: field,
			centralLabel: capitalize(field),
			centralSubLabel: `${insertCommas(sum)} total`,
			subtitle: flavor.description,
			footer: flavor.quip,
			data,
		};
	}

	function getDataPoints(field: keyof Counts): {
		data: DataPoint[];
		sum: number;
	} {
		if (bundle.value === undefined) {
			throw new Error("Bundle Undefined");
		}

		let data: DataPoint[] = [];
		let sum = 0;

		for (const [person, statistic] of Object.entries(
			bundle.value.personal
		)) {
			const value = statistic.counts[field];
			sum += value;
			data.push({
				value,
				label: person,
			});
		}

		return { data, sum };
	}
</script>

<div class="flex justify-center">
	<Carousel.Root
		opts={{
			align: "start",
			loop: true,
		}}
		class="w-full max-w-lg"
	>
		<Carousel.Content>
			{#each data as d}
				<Carousel.Item>
					<PieCard {...d} />
				</Carousel.Item>
			{/each}
		</Carousel.Content>
		<Carousel.Previous />
		<Carousel.Next />
	</Carousel.Root>
</div>
