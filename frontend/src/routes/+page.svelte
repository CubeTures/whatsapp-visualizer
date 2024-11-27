<script lang="ts">
	import PieCard, { type Props } from "$lib/components/pieCard.svelte";
	import useBundle from "$lib/hooks/useBundle.svelte";
	import type { DataPoint } from "$lib/interfaces/props";
	import type { Counts } from "$lib/interfaces/structs";
	import "$lib/styles/global.css";

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
		if (bundle === undefined) {
			return [];
		}

		let result: Props[] = [];
		for (const field of fields) {
			let data: DataPoint[] = [];
			for (const [person, statistic] of Object.entries(bundle.personal)) {
				data.push({
					value: statistic.counts[field],
					label: person,
				});
			}

			result.push({
				title: field,
				subtitle: "TBD",
				footer: "TBD",
				data,
			});
		}

		return result;
	});
</script>

{#each data as d}
	<PieCard {...d} />
{/each}

{#if bundle}
	{JSON.stringify(bundle.aggregate.counts)}
{/if}
