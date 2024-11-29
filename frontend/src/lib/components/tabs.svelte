<script lang="ts">
	import * as Tabs from "$lib/components/ui/tabs/index";
	import type { Component } from "svelte";

	interface Props {
		tabs: string[];
		components: Component[];
	}

	const { tabs, components }: Props = $props();

	if (tabs.length !== components.length) {
		throw new Error("Unequal tab lengths");
	}
</script>

<Tabs.Root value={tabs[0]}>
	<Tabs.List
		class="grid w-full"
		style="grid-template-columns: repeat({tabs.length}, minmax(0, 1fr));"
	>
		{#each tabs as tab}
			<Tabs.Trigger value={tab}>{tab}</Tabs.Trigger>
		{/each}
	</Tabs.List>
	{#each tabs as tab, index}
		{@const Component = components[index]}
		<Tabs.Content value={tab}><Component /></Tabs.Content>
	{/each}
</Tabs.Root>
