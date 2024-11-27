<script lang="ts">
	import * as Card from "$lib/components/ui/card/index";
	import type { DataPoint } from "$lib/interfaces/props";
	import SimplePie from "./simplePie.svelte";

	export interface Props {
		title: string;
		subtitle: string;
		footer: string;
		data: DataPoint[];
	}

	const { title, subtitle, footer, data }: Props = $props();
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>{title}</Card.Title>
		<Card.Description>{subtitle}</Card.Description>
	</Card.Header>
	<Card.Content>
		<SimplePie {data} />
	</Card.Content>
	<Card.Footer>
		<p>{footer}</p>
	</Card.Footer>
</Card.Root>
