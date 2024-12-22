import type { AveragesKey, FlavorPair, FlavorStats } from "./types.ts";
import { flavor } from "./flavor.ts";
import { Counts, Bundle } from "./structures.ts";
import {
	asFraction,
	chartColor,
	nameOf,
	sortByAverage,
	sortByCounts,
	strong,
	ul,
} from "./helpers.ts";

export function getCountsFlavor(
	bundle: Bundle,
	field: keyof Counts
): FlavorPair {
	const stats = getStats(bundle, field);
	const { length } = stats;
	let result = "";

	for (const line of flavor.counts[field].quip.normal) {
		result += (result === "" ? "" : " ") + insert(line, stats);
	}

	if (length > 2) {
		for (const line of flavor.counts[field].quip.group) {
			result += result === "" ? "" : " " + insert(line, stats);
		}
	}

	result += ".";
	return {
		description: flavor.counts[field].description,
		quip: result,
	};
}

export function getAveragesFlavor(
	bundle: Bundle,
	field: AveragesKey
): FlavorPair {
	const stats = getAverageStats(bundle, field);
	const { length } = stats;
	let result = "";

	for (const line of flavor.averages[field].quip.normal) {
		result += (result === "" ? "" : " ") + insert(line, stats);
	}

	if (length > 2) {
		for (const line of flavor.averages[field].quip.group) {
			result += result === "" ? "" : " " + insert(line, stats);
		}
	}

	result += ".";
	return {
		description: flavor.averages[field].description,
		quip: result,
	};
}

function insert(line: string, stats: FlavorStats): string {
	const { top, next, bot, diffNext, diffBot } = stats;
	let result: string = line;

	result = result.replace("_t", top);
	result = result.replace("_n", next);
	result = result.replace("_b", bot);
	result = result.replace("_dn", diffNext);
	result = result.replace("_db", diffBot);
	result = result.replace("S's", "S'");
	result = result.replace("s's", "s'");

	return result;
}

function getStats(bundle: Bundle, field: keyof Counts): FlavorStats {
	const order = Object.keys(bundle);
	const sorted = sortByCounts(bundle, field);

	const top = sorted[0];
	const next = sorted[1];
	const bot = sorted[sorted.length - 1];

	const nameTop = ul(nameOf(top), chartColor(order.indexOf(top)));
	const nameNext = ul(nameOf(next), chartColor(order.indexOf(next)));
	const nameBot = ul(nameOf(bot), chartColor(order.indexOf(bot)));

	const diffNext = strong(
		(
			bundle[top].counts[field] - bundle[next].counts[field]
		).toLocaleString()
	);
	const diffBot = strong(
		(bundle[top].counts[field] - bundle[bot].counts[field]).toLocaleString()
	);

	return {
		top: nameTop,
		next: nameNext,
		bot: nameBot,
		diffNext,
		diffBot,
		length: sorted.length,
	};
}

function getAverageStats(bundle: Bundle, field: AveragesKey): FlavorStats {
	const order = Object.keys(bundle);
	const sorted = sortByAverage(bundle, field);

	const top = sorted[0];
	const next = sorted[1];
	const bot = sorted[sorted.length - 1];

	const nameTop = ul(nameOf(top), chartColor(order.indexOf(top)));
	const nameNext = ul(nameOf(next), chartColor(order.indexOf(next)));
	const nameBot = ul(nameOf(bot), chartColor(order.indexOf(bot)));

	const diffNext = strong(
		asFraction(
			bundle[top].counts[field] - bundle[next].counts[field],
			bundle[top].counts.messages + bundle[next].counts.messages
		).toLocaleString()
	);
	const diffBot = strong(
		asFraction(
			bundle[top].counts[field] - bundle[bot].counts[field],
			bundle[top].counts.messages + bundle[bot].counts.messages
		).toLocaleString()
	);

	return {
		top: nameTop,
		next: nameNext,
		bot: nameBot,
		diffNext,
		diffBot,
		length: sorted.length,
	};
}
