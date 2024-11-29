<script lang="ts">
	import CountsCarousel from "$lib/components/countsCarousel.svelte";
	import Tabs from "$lib/components/tabs.svelte";
</script>

<div class="flex justify-center">
	<Tabs
		tabs={["Counts"]}
		components={[CountsCarousel]}
	/>
</div>
