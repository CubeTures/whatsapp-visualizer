import type { Bundle } from "$lib/interfaces/structs";

export default function useBundle() {
	let bundle: Bundle | undefined = $state();

	fetchBundle<Bundle>("RealChatExport.json")
		.then((b) => (bundle = b))
		.catch((err) => console.error(err));

	return bundle;
}

async function fetchBundle<T>(fileName: string): Promise<T> {
	const path: string = `$lib/data/${fileName}`;

	const response: Response = await fetch(path);
	const json = await response.json();
	const parsed = await JSON.parse(json);
	return parsed as T;
}
