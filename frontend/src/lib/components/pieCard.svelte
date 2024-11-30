<script lang="ts">
	import * as Card from "$lib/components/ui/card/index";

	import type { DataPoint } from "$lib/interfaces/interfaces";
	import { insertCommas } from "$lib/scripts/helpers";
	import Pie from "./pie.svelte";

	export interface Props {
		title: string;
		subtitle: string;
		footer: string;
		data: DataPoint[];
		metric: string;
		centralLabel?: string;
		centralSubLabel?: string;
	}

	const {
		title,
		subtitle,
		footer,
		data,
		metric,
		centralLabel,
		centralSubLabel,
	}: Props = $props();

	const getValue = (d: DataPoint) => d.value;
	const getLabel = (d: DataPoint) =>
		`<span><strong>${d.label}</strong></br>${insertCommas(d.value)} ${metric}</span>`;
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>{title}</Card.Title>
		<Card.Description>{subtitle}</Card.Description>
	</Card.Header>
	<Card.Content>
		<Pie
			{data}
			{getValue}
			{getLabel}
			{centralLabel}
			{centralSubLabel}
		/>
	</Card.Content>
	<Card.Footer>
		<p>{@html footer}</p>
	</Card.Footer>
</Card.Root>
