import { Counts, Personal } from "./structures";
import { AveragesKey, TimesKey } from "./types";

export function isNumber(num: any): num is number {
	if (typeof num === "number") {
		return num - num === 0;
	}

	if (typeof num === "string" && num.trim() !== "") {
		return Number.isFinite ? Number.isFinite(+num) : isFinite(+num);
	}

	return false;
}

export function chartColor(i: number): string {
	return `hsl(var(--chart-${(i % 5) + 1}))`;
}

export function decapitalize(s: string): string {
	return s.length >= 1 ? s.at(0)?.toLocaleLowerCase() + s.substring(1) : s;
}

export function capitalize(s: string): string {
	return s.length >= 1 ? s.at(0)?.toLocaleUpperCase() + s.substring(1) : s;
}

export function capitalizeAll(s: string, separator: string = " "): string {
	return s
		.split(separator)
		.map((w) => capitalize(w))
		.join(separator);
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

export function sortByAverage(
	personal: Personal,
	field: AveragesKey
): string[] {
	return Object.keys(personal).sort(
		(a, b) =>
			personal[b].counts[field] / personal[b].counts.messages -
			personal[a].counts[field] / personal[a].counts.messages
	);
}

export function insertCommas(num: number): string {
	let result: string = "";

	if (num === 0) {
		return "0";
	}

	const decimals = num % 1;
	num = Math.trunc(num);

	if (num === 0) {
		result = (Math.round(decimals * 100000) / 100000).toFixed(5);
	}

	while (num > 0) {
		const mod = Math.trunc(num % 1000);
		num = Math.trunc(num / 1000);

		const ms: string = num > 0 ? `${mod}`.padStart(3, "0") : mod.toString();

		if (result == "") {
			if (decimals - 0.001 > 0) {
				result = (Math.round(decimals * 1000) / 1000 + mod).toFixed(3);
			} else {
				result = ms;
			}
		} else {
			result = `${ms},${result}`;
		}
	}

	return result;
}

export function numberToDate(
	field: TimesKey,
	index: number,
	length: "short" | "long" = "short"
): string {
	if (field === "hour") {
		const referenceDate = new Date(1970, 0, 1, index);
		return referenceDate.toLocaleTimeString("en-US", {
			hour: "numeric",
			hour12: true,
		});
	} else if (field === "weekday") {
		const referenceDate = new Date(1970, 0, index + 4);
		return referenceDate.toLocaleDateString("en-US", { weekday: length });
	} else if (field === "month") {
		const referenceDate = new Date(1970, index, 1);
		return referenceDate.toLocaleDateString("en-US", { month: length });
	} else if (field === "year") {
		return index.toString();
	} else {
		throw new Error(`Cannot convert ${index} to a ${field}`);
	}
}

export function ul(str: string, colorA?: string, bold: boolean = true): string {
	const underline: string = "text-decoration: underline;";
	const color: string = colorA ? `text-decoration-color: ${colorA}` : "";
	return `<span style="${underline}${color}">${
		bold ? strong(str) : str
	}</span>`;
}

export function strong(str: string): string {
	return `<strong>${str}</strong>`;
}

export function asFraction(count: number, total: number) {
	const num = (count > total ? count / total : 1).toLocaleString();
	const den = (
		count > total ? 1 : Math.round(total / count)
	).toLocaleString();
	return count > total ? num : `${num}/${den}`;
}