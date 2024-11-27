export interface Bundle {
	personal: Personal;
	aggregate: Statistic;
}

interface Personal {
	[name: string]: Statistic;
}

interface Statistic {
	counts: Counts;
	frequencies: Frequencies;
	counts_by_time: CountsByTime;
	lengths: Lengths;
}

interface Counts {
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

interface Frequencies {
	phrases: FrequencyMap;
	words: FrequencyMap;
	emojis: FrequencyMap;
	links: FrequencyMap;
}

interface FrequencyMap {
	[key: string]: number;
}

interface CountsByTime {
	hour: Counts[];
	weekday: Counts[];
	month: Counts[];
	year: {
		[year: number]: Counts;
	};
	exact: {
		[year: number]: {
			[month: number]: {
				[day: number]: {
					[hour: number]: Counts;
				};
			};
		};
	};
}

interface Lengths {
	longest_messages: [
		{
			message: string;
			length: number;
		}
	];
	average_messages_per_person: number;
	average_emojis_per_person: number;
}
