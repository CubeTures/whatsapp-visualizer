import { useBundle } from "@/hooks/context";
import { Frequencies as FrequenciesStruct } from "@/lib/structures";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import PaginatedTable from "./paginatedTable";
import { capitalize } from "@/lib/helpers";
import { CarouselItem } from "./ui/carousel";
import { Card, CardContent } from "./ui/card";
import Longest from "./longest";
import Carousel from "./carousel";
import CardHeader from "./cardHeader";
import FrequenciesDetailed from "./frequenciesDetailed";
import Sorter from "./sorter";
import Header from "./header";

export interface Frequency {
	content: string;
	count: number;
	rank: number;
	people: Record<string, Date[]>;
}

export const singular: Record<keyof FrequenciesStruct, string> = {
	phrases: "Phrase",
	words: "Word",
	emojis: "Emoji",
	links: "Link",
};

function Frequencies() {
	const bundle = useBundle();

	const fields: (keyof FrequenciesStruct)[] = [
		"phrases",
		"words",
		"emojis",
		"links",
	];

	const data = useMemo(getData, [bundle]);

	function getData(): Frequency[][] {
		let result = [];

		for (const field of fields) {
			result.push(getFieldData(field));
		}

		return result;
	}

	function getFieldData(field: keyof FrequenciesStruct): Frequency[] {
		let result: Record<string, Frequency> = {};

		for (const [person, statistic] of Object.entries(bundle)) {
			for (const [key, dates] of Object.entries(
				statistic.frequencies[field]
			)) {
				const people: any = result[key]?.people ?? {};
				people[person] = dates
					.map((d) => new Date(d))
					.sort((a, b) => b.valueOf() - a.valueOf());

				if (result[key] === undefined) {
					result[key] = {
						content: key,
						count: dates.length,
						rank: -1,
						people,
					};
				} else {
					result[key] = {
						...result[key],
						count: result[key].count + dates.length,
						people,
					};
				}
			}
		}

		return Object.entries(result)
			.sort(([, a], [, b]) => b.count - a.count)
			.map(([_, value], index) => ({
				...value,
				rank: index + 1,
			}));
	}

	const columns: ColumnDef<Frequency>[][] = fields.map(
		(field): ColumnDef<Frequency>[] => [
			{
				accessorKey: "rank",
				header: "Rank",
			},
			{
				accessorKey: "content",
				header: (props) => Sorter(singular[field], props),
				cell: ({ row }) => {
					let content = row.getValue<string>("content");
					if (field === "words") {
						content = capitalize(content);
					}

					return content;
				},
			},
			{
				accessorKey: "count",
				header: (props) => Sorter("Times Used", props),
				cell: ({ row }) => {
					const value = (
						row.getValue("count") as number
					).toLocaleString();

					return (
						<div className="font-mono font-medium tabular-nums">
							{value}
						</div>
					);
				},
			},
			{
				accessorKey: "people",
				header: "People",
				cell: (cell) => (
					<FrequenciesDetailed
						field={field}
						cell={cell}
					/>
				),
			},
		]
	);

	function Content(field: keyof FrequenciesStruct, index: number) {
		let desc = undefined;

		if (field === "phrases") {
			desc =
				"Phrases are any 3 word or less messages under 50 characters after links are excluded.";
		} else if (field === "links") {
			desc = `Only links beginning with "www", "http", and "https" were counted. Results are accumulated by hostname and may not be 100% accurate.`;
		}

		return (
			<Card>
				<CardHeader
					title={`Frequency of ${capitalize(field)}`}
					desc={desc}
				/>
				<CardContent>
					<PaginatedTable
						data={data[index]}
						columns={columns[index]}
						filters={[
							{
								name: capitalize(field),
								columnKey: "content",
							},
						]}
					/>
				</CardContent>
			</Card>
		);
	}

	return (
		<>
			<Header
				title="Frequencies and Length"
				desc="The frequency tables keep track of the dates each time a figure was used. Filter the result to find a specific item, then see more info about it by clicking the eye. Further explore by seeing how many by day it was used by a person. Your mind is the limit with this; compile your own statistics! Then, see the longest messages sent in your chat history."
			/>
			<Carousel>
				{fields.map((field, index) => (
					<CarouselItem
						key={index}
						className="flex flex-col gap-4">
						{Content(field, index)}
					</CarouselItem>
				))}
				<CarouselItem>
					<Longest />
				</CarouselItem>
			</Carousel>
		</>
	);
}

export default Frequencies;
