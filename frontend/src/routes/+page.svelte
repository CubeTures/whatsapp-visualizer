<script lang="ts">
	import CountsCarousel from "$lib/components/countsCarousel.svelte";
	import AveragesCarousel from "$lib/components/averagesCarousel.svelte";
	import Tabs from "$lib/components/tabs.svelte";
</script>

<div class="flex justify-center">
	<Tabs
		tabs={["Counts", "Averages"]}
		components={[CountsCarousel, AveragesCarousel]}
	/>
</div>
