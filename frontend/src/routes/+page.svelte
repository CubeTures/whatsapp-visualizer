<script lang="ts">
	import SimplePie from "../components/simplePie.svelte";
	import { classList } from "../hooks/classList";
	import "../styles/global.css";
</script>

<svelte:body use:classList={["theme-dark", "bg-neutral-800"]} />

<SimplePie
	data={[
		{
			value: 2,
			label: "A",
		},
		{
			value: 5,
			label: "B",
		},
		{
			value: 3,
			label: "C",
		},
	]}
/>
