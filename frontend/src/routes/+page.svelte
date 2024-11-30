<script lang="ts">
	import CountsCarousel from "$lib/components/countsCarousel.svelte";
	import AveragesCarousel from "$lib/components/averagesCarousel.svelte";
	import Tabs from "$lib/components/tabs.svelte";
	import TimeBars from "$lib/components/timeBarsCarousel.svelte";
</script>

<div class="flex justify-center">
	<Tabs
		tabs={["Counts", "Averages"]}
		components={[CountsCarousel, AveragesCarousel]}
	/>
</div>

<div class="flex justify-center">
	<!-- <Tabs
		tabs={["Hour", "Weekday", "Month", "Year"]}
		components={[Filler, Filler, Filler, Filler]}
	/> -->
	<TimeBars />
</div>
