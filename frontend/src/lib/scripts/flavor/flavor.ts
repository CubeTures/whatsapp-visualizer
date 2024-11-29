import type { Flavor } from "$lib/interfaces/interfaces";

export function unovisColor(num: number): string {
	return `var(--vis-dark-color${Math.trunc(num % 6)})`;
}

export const flavor: Flavor = {
	counts: {
		messages: {
			description:
				"The total number of messages sent throughout the entire conversation history.",
			quip: {
				normal: [
					"_t is a certified yapper.",
					"They sent _dn more messages than _n",
				],
				group: ["and _db more than _b"],
			},
		},
		words: {
			description:
				"The total number of words used throughout the entire conversation history.",
			quip: {
				normal: [
					"_t seems to ramble...",
					"They used _dn more words than _n",
				],
				group: ["and _db more than _b"],
			},
		},
		letters: {
			description:
				"The total number of letters used throughout the entire conversation history.",
			quip: {
				normal: [
					"_t's fingers must be tired.",
					"They typed _dn more letters than _n",
				],
				group: ["and _db more than _b"],
			},
		},
		emojis: {
			description:
				"The total number of emojis used throughout the entire conversation history.",
			quip: {
				normal: [
					"_t can't seem to express themselves using words.",
					"They used _dn more emojis than _n",
				],
				group: ["and _db more than _b"],
			},
		},
		links: {
			description:
				"The total number of links sent throughout the entire conversation history.",
			quip: {
				normal: [
					"_t is chronically online.",
					"They sent _dn more links than _n",
				],
				group: ["and _db more than _b"],
			},
		},
		media: {
			description:
				"The total number of media sent throughout the entire conversation history.",
			quip: {
				normal: [
					"_t should just download snapchat.",
					"They sent _dn more pieces of media than _n",
				],
				group: ["and _db more than _b"],
			},
		},
		calls: {
			description:
				"The total number of calls made throughout the entire conversation history.",
			quip: {
				normal: [
					"_t likes the sound of their own voice.",
					"They started _dn more calls than _n",
				],
				group: ["and _db more than _b"],
			},
		},
		deleted: {
			description:
				"The total number of messages deleted throughout the entire conversation history.",
			quip: {
				normal: [
					"_t seems to text before they think.",
					"They deleted _dn more messages than _n",
				],
				group: ["and _db more than _b"],
			},
		},
		edited: {
			description:
				"The total number of messages edited throughout the entire conversation history.",
			quip: {
				normal: [
					"_t makes a lot of typos.",
					"They edited _dn more messages than _n",
				],
				group: ["and _db more than _b"],
			},
		},
	},
	averages: {
		words: {
			description:
				"The average number of words per message used throughout the entire conversation history.",
			quip: {
				normal: [
					"_t seems to ramble...",
					"They used _dn more words per message than _n",
				],
				group: ["and _db more than _b"],
			},
		},
		letters: {
			description:
				"The average number of letters per message used throughout the entire conversation history.",
			quip: {
				normal: [
					"_t's fingers must be tired.",
					"They typed _dn more letters per message than _n",
				],
				group: ["and _db more than _b"],
			},
		},
		emojis: {
			description:
				"The average number of emojis per message used throughout the entire conversation history.",
			quip: {
				normal: [
					"_t can't seem to express themselves using words.",
					"They used _dn more emojis per message than _n",
				],
				group: ["and _db more than _b"],
			},
		},
		links: {
			description:
				"The average number of links per message sent throughout the entire conversation history.",
			quip: {
				normal: [
					"_t is chronically online.",
					"They sent _dn more links per message than _n",
				],
				group: ["and _db more than _b"],
			},
		},
		media: {
			description:
				"The average number of media per message sent throughout the entire conversation history.",
			quip: {
				normal: [
					"_t should just download snapchat.",
					"They sent _dn more pieces of media per message than _n",
				],
				group: ["and _db more than _b"],
			},
		},
		calls: {
			description:
				"The average number of calls per message made throughout the entire conversation history.",
			quip: {
				normal: [
					"_t likes the sound of their own voice.",
					"They started _dn more calls per message than _n",
				],
				group: ["and _db more than _b"],
			},
		},
		deleted: {
			description:
				"The average number of messages deleted per message throughout the entire conversation history.",
			quip: {
				normal: [
					"_t seems to text before they think.",
					"They deleted _dn more messages per message than _n",
				],
				group: ["and _db more than _b"],
			},
		},
		edited: {
			description:
				"The average number of messages edited per message throughout the entire conversation history.",
			quip: {
				normal: [
					"_t makes a lot of typos.",
					"They edited _dn more messages per message than _n",
				],
				group: ["and _db more than _b"],
			},
		},
	},
};
