import type { FlavorPair, FlavorStats } from "$lib/interfaces/interfaces";
import type { Counts, Personal } from "$lib/interfaces/structs";
import { strong, insertCommas, nameOf, sortByCounts, ul } from "../helpers";
import { flavor, unovisColor } from "./flavor";

export function getCountsFlavor(
	people: Personal,
	field: keyof Counts
): FlavorPair {
	const stats = getStats(people, field);
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

function insert(line: string, stats: FlavorStats): string {
	const { top, next, bot, diffNext, diffBot } = stats;
	let result: string = line;

	result = result.replaceAll("_t", top);
	result = result.replaceAll("_n", next);
	result = result.replaceAll("_b", bot);
	result = result.replaceAll("_dn", diffNext);
	result = result.replaceAll("_db", diffBot);
	result = result.replaceAll("S's", "S'");
	result = result.replaceAll("s's", "s'");

	return result;
}

function getStats(people: Personal, field: keyof Counts): FlavorStats {
	const order = Object.keys(people);
	const sorted = sortByCounts(people, field);

	const top = sorted[0];
	const next = sorted[1];
	const bot = sorted[sorted.length - 1];

	const nameTop = ul(nameOf(top), unovisColor(order.indexOf(top)));
	const nameNext = ul(nameOf(next), unovisColor(order.indexOf(next)));
	const nameBot = ul(nameOf(bot), unovisColor(order.indexOf(bot)));

	const diffNext = strong(
		insertCommas(people[top].counts[field] - people[next].counts[field])
	);
	const diffBot = strong(
		insertCommas(people[top].counts[field] - people[bot].counts[field])
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
