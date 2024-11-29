import type { Counts, Personal } from "$lib/interfaces/structs";
import { strong, insertCommas, nameOf, sortByCounts, ul } from "./helpers";

export function unovisColor(num: number): string {
	return `var(--vis-dark-color${Math.trunc(num % 6)})`;
}

interface Flavor {
	description: string;
	quip: (personal: Personal) => string;
}

export const flavorCounts: Record<keyof Counts, Flavor> = {
	messages: {
		description:
			"The total number of messages sent throughout the entire conversation history.",
		quip: messagesCountQuip,
	},
	words: {
		description:
			"The total number of words used throughout the entire conversation history.",
		quip: wordsCountQuip,
	},
	letters: {
		description:
			"The total number of letters used throughout the entire conversation history.",
		quip: lettersCountQuip,
	},
	emojis: {
		description:
			"The total number of emojis used throughout the entire conversation history.",
		quip: emojisCountQuip,
	},
	links: {
		description:
			"The total number of links sent throughout the entire conversation history.",
		quip: linksCountQuip,
	},
	media: {
		description:
			"The total number of media sent throughout the entire conversation history.",
		quip: mediaCountQuip,
	},
	calls: {
		description:
			"The total number of calls made throughout the entire conversation history.",
		quip: callsCountQuip,
	},
	deleted: {
		description:
			"The total number of messages deleted throughout the entire conversation history.",
		quip: deletedCountQuip,
	},
	edited: {
		description:
			"The total number of messages edited throughout the entire conversation history.",
		quip: editedCountQuip,
	},
};

function messagesCountQuip(people: Personal): string {
	const { top, next, bot, diffNext, diffBot, length } = getStats(
		people,
		"messages"
	);

	const start = `${top} is a certified yapper.`;
	const middle = `They sent ${diffNext} more messages than ${next}`;
	const end = `and ${diffBot} more than ${bot}`;

	if (length == 2) {
		return `${start} ${middle}.`;
	} else {
		return `${start} ${middle} ${end}.`;
	}
}

function wordsCountQuip(people: Personal): string {
	const { top, next, bot, diffNext, diffBot, length } = getStats(
		people,
		"words"
	);

	const start = `${top} seems to ramble...`;
	const middle = `They used ${diffNext} more words than ${next}`;
	const end = `and ${diffBot} more than ${bot}`;

	if (length == 2) {
		return `${start} ${middle}.`;
	} else {
		return `${start} ${middle} ${end}.`;
	}
}

function lettersCountQuip(people: Personal): string {
	const { top, next, bot, diffNext, diffBot, length } = getStats(
		people,
		"letters"
	);

	const useS = top.charAt(top.length - 1) != "s";
	const start = `${top}'${useS ? "s" : ""} fingers must be tired.`;
	const middle = `They typed ${diffNext} more letters than ${next}`;
	const end = `and ${diffBot} more than ${bot}`;

	if (length == 2) {
		return `${start} ${middle}.`;
	} else {
		return `${start} ${middle} ${end}.`;
	}
}

function emojisCountQuip(people: Personal): string {
	const { top, next, bot, diffNext, diffBot, length } = getStats(
		people,
		"emojis"
	);

	const start = `${top} can't seem to express themselves using words.`;
	const middle = `They used ${diffNext} more emojis than ${next}`;
	const end = `and ${diffBot} more than ${bot}`;

	if (length == 2) {
		return `${start} ${middle}.`;
	} else {
		return `${start} ${middle} ${end}.`;
	}
}

function linksCountQuip(people: Personal): string {
	const { top, next, bot, diffNext, diffBot, length } = getStats(
		people,
		"links"
	);

	const start = `${top} is chronically online.`;
	const middle = `They sent ${diffNext} more links than ${next}`;
	const end = `and ${diffBot} more than ${bot}`;

	if (length == 2) {
		return `${start} ${middle}.`;
	} else {
		return `${start} ${middle} ${end}.`;
	}
}

function mediaCountQuip(people: Personal): string {
	const { top, next, bot, diffNext, diffBot, length } = getStats(
		people,
		"media"
	);

	const start = `${top} should just download snapchat.`;
	const middle = `They sent ${diffNext} more pieces of media than ${next}`;
	const end = `and ${diffBot} more than ${bot}`;

	if (length == 2) {
		return `${start} ${middle}.`;
	} else {
		return `${start} ${middle} ${end}.`;
	}
}

function callsCountQuip(people: Personal): string {
	const { top, next, bot, diffNext, diffBot, length } = getStats(
		people,
		"calls"
	);

	const start = `${top} likes the sound of their own voice.`;
	const middle = `They started ${diffNext} more calls than ${next}`;
	const end = `and ${diffBot} more than ${bot}`;

	if (length == 2) {
		return `${start} ${middle}.`;
	} else {
		return `${start} ${middle} ${end}.`;
	}
}

function deletedCountQuip(people: Personal): string {
	const { top, next, bot, diffNext, diffBot, length } = getStats(
		people,
		"deleted"
	);

	const start = `${top} seems to text before they think.`;
	const middle = `They deleted ${diffNext} more messages than ${next}`;
	const end = `and ${diffBot} more than ${bot}`;

	if (length == 2) {
		return `${start} ${middle}.`;
	} else {
		return `${start} ${middle} ${end}.`;
	}
}

function editedCountQuip(people: Personal): string {
	const { top, next, bot, diffNext, diffBot, length } = getStats(
		people,
		"edited"
	);

	const start = `${top} makes a lot of typos.`;
	const middle = `They edited ${diffNext} more messages than ${next}`;
	const end = `and ${diffBot} more than ${bot}`;

	if (length == 2) {
		return `${start} ${middle}.`;
	} else {
		return `${start} ${middle} ${end}.`;
	}
}

function getStats(people: Personal, field: keyof Counts) {
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
