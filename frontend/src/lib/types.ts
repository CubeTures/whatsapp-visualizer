import { Counts, CountsByTime } from "./structures";

export interface Flavor {
	counts: {
		[key in keyof Counts]: FlavorPairUnparsed;
	};
	averages: {
		[key in AveragesKey]: FlavorPairUnparsed;
	};
}

interface FlavorPairUnparsed {
	description: string;
	quip: {
		normal: string[];
		group: string[];
	};
}

export interface FlavorPair {
	description: string;
	quip: string;
}

export interface FlavorStats {
	top: string;
	next: string;
	bot: string;
	diffNext: string;
	diffBot: string;
	length: number;
}

export type AveragesKey = Exclude<keyof Counts, "messages">;
export type TimesKey = Exclude<keyof CountsByTime, "exact">;

export interface Filters {
	people: string[];
	statistic: Statistic;
	metric: keyof Counts;
	start: Date;
	end: Date;
}

export type Statistic = "totals" | "averages";

export interface TableFilter<T> {
	name: string;
	columnKey: keyof T;
}
