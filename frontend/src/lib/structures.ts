export type Bundle = Record<string, Statistic>;

export interface Statistic {
	counts: Counts;
	frequencies: Frequencies;
	counts_by_time: CountsByTime;
	lengths: Lengths;
}

export interface Counts {
	messages: number;
	words: number;
	letters: number;
	emojis: number;
	links: number;
	media: number;
	calls: number;
	deleted: number;
	edited: number;
}

export interface Frequencies {
	phrases: FrequenciesMap;
	words: FrequenciesMap;
	emojis: FrequenciesMap;
	links: FrequenciesMap;
}

type FrequenciesMap = Record<string, string[]>;

export interface CountsByTime {
	hour: Counts[];
	weekday: Counts[];
	month: Counts[];
	year: Record<number, Counts>;
	exact: Record<
		number,
		Record<number, Record<number, Record<number, Counts>>>
	>;
}

export interface Lengths {
	longest_messages: {
		date: string;
		message: string;
		length: number;
	}[];
}
