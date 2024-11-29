import type { Counts, Personal } from "$lib/interfaces/structs";

export function capitalize(str: string, sep: string = " "): string {
	return str
		.split(sep)
		.map(
			(s) =>
				s.at(0)?.toLocaleUpperCase() +
				s.substring(1).toLocaleLowerCase()
		)
		.join(" ");
}

export function nameOf(name: string): string {
	return name.split(" ")[0];
}

export function sortByCounts(
	personal: Personal,
	field: keyof Counts
): string[] {
	return Object.keys(personal).sort(
		(a, b) => personal[b].counts[field] - personal[a].counts[field]
	);
}

export function insertCommas(num: number): string {
	let result: string = "";
	const decimals = num % 1;
	num = Math.trunc(num);

	while (num > 0) {
		const mod = Math.trunc(num % 1000);
		num = Math.trunc(num / 1000);

		if (result == "") {
			result = `${mod}`;
		} else {
			result = `${mod},${result}`;
		}
	}

	return result;
}

export function ul(str: string, colorA?: string): string {
	const underline: string = "text-decoration: underline;";
	const color: string = colorA ? `text-decoration-color: ${colorA}` : "";
	return `<span style="${underline}${color}"><strong>${str}</strong></span>`;
}

export function strong(str: string): string {
	return `<strong>${str}</strong>`;
}
