import type { Counts } from "./structs";

// type Paths<T> = T extends object
// 	? {
// 			[K in keyof T]: `${Exclude<K, symbol>}${"" | `.${Paths<T[K]>}`}`;
// 	  }[keyof T]
// 	: never;

// type Leaves<T> = T extends object
// 	? {
// 			[K in keyof T]: `${Exclude<K, symbol>}${Leaves<T[K]> extends never
// 				? ""
// 				: `.${Leaves<T[K]>}`}`;
// 	  }[keyof T]
// 	: never;

export interface Flavor {
	counts: {
		[key in keyof Counts]: FlavorPairUnparsed;
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
