<script lang="ts">
	import CountsCarousel from "$lib/components/countsCarousel.svelte";
	import NormalizedCarousel from "$lib/components/normalizedCarousel.svelte";
	import Tabs from "$lib/components/tabs.svelte";
</script>

<div class="flex justify-center">
	<Tabs
		tabs={["Counts", "Normalized"]}
		components={[CountsCarousel, NormalizedCarousel]}
	/>
</div>
