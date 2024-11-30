<script lang="ts">
	import * as Carousel from "$lib/components/ui/carousel/index";

	const { children } = $props();
</script>

<Carousel.Item>
	{@render children?.()}
</Carousel.Item>
