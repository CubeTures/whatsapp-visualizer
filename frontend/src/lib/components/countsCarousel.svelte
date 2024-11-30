<script lang="ts">
	import PieCard, { type Props } from "$lib/components/pieCard.svelte";
	import useBundle from "$lib/hooks/useBundle.svelte";

	import type { DataPoint } from "$lib/interfaces/interfaces";
	import type { Counts, Personal } from "$lib/interfaces/structs";
	import * as Carousel from "$lib/components/ui/carousel/index";
	import "$lib/styles/global.css";
	import { capitalize, insertCommas } from "$lib/scripts/helpers";
	import { getCountsFlavor } from "$lib/scripts/flavor/countFlavor";

	const bundle = useBundle();

	const fields: (keyof Counts)[] = [
		"messages",
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
			result.push(getFieldProps(bundle.value.personal, field));
		}

		return result;
	});

	function getFieldProps(people: Personal, field: keyof Counts): Props {
		const flavor = getCountsFlavor(people, field);
		const { data, sum } = getDataPoints(people, field);

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

	function getDataPoints(
		people: Personal,
		field: keyof Counts
	): {
		data: DataPoint[];
		sum: number;
	} {
		let data: DataPoint[] = [];
		let sum = 0;

		for (const [person, statistic] of Object.entries(people)) {
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
