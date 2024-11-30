<script lang="ts">
	import * as Carousel from "$lib/components/ui/carousel/index";

	const { children } = $props();
</script>

<Carousel.Root
	opts={{
		align: "start",
		loop: true,
	}}
	class="w-full max-w-lg"
>
	<Carousel.Content>
		{@render children?.()}
	</Carousel.Content>
	<Carousel.Previous />
	<Carousel.Next />
</Carousel.Root>
