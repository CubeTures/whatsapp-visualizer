import { useBundle } from "@/hooks/context";
import { Frequencies as FrequenciesStruct } from "@/lib/structures";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import PaginatedTable from "./paginatedTable";
import { capitalize, capitalizeAll, decapitalize } from "@/lib/helpers";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "./ui/carousel";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { ArrowUpDown, Eye } from "lucide-react";
import Popup from "./popup";
import Longest from "./longest";

function Frequencies() {
	const bundle = useBundle();

	interface Frequency {
		content: string;
		count: number;
		rank: number;
		people: Record<string, number>;
	}

	const fields: (keyof FrequenciesStruct)[] = [
		"phrases",
		"words",
		"emojis",
		"links",
	];

	const singular: Record<keyof FrequenciesStruct, string> = {
		phrases: "Phrase",
		words: "Word",
		emojis: "Emoji",
		links: "Link",
	};

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

		for (const [person, statistic] of Object.entries(bundle.personal)) {
			for (const [key, value] of Object.entries(
				statistic.frequencies[field]
			)) {
				const people: any = result[key]?.people ?? {};
				people[person] = value;

				if (result[key] === undefined) {
					result[key] = {
						content: key,
						count: value,
						rank: -1,
						people,
					};
				} else {
					result[key] = {
						...result[key],
						count: result[key].count + value,
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
				header: ({ column }) => {
					return (
						<Button
							variant="ghost"
							onClick={() =>
								column.toggleSorting(
									column.getIsSorted() === "asc"
								)
							}>
							{singular[field]}
							<ArrowUpDown className="ml-2 h-4 w-4" />
						</Button>
					);
				},
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
				header: ({ column }) => {
					return (
						<div>
							<Button
								variant="ghost"
								onClick={() =>
									column.toggleSorting(
										column.getIsSorted() === "asc"
									)
								}>
								Times Used
								<ArrowUpDown className="ml-2 h-4 w-4" />
							</Button>
						</div>
					);
				},
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
				cell: ({ row }) => {
					const content = row.getValue<string>("content");
					const rank = row.getValue<number>("rank");
					const count = row.getValue<number>("count");
					const people =
						row.getValue<Record<string, number>>("people");

					const trigger = (
						<Button variant="ghost">
							<Eye className="h-4 w-4" />
						</Button>
					);

					return (
						<Popup
							trigger={trigger}
							title={`#${rank.toLocaleString()} Most Used ${
								singular[field]
							}`}
							desc={`The ${decapitalize(
								singular[field]
							)} "${content}" was used ${count.toLocaleString()} time${count === 1 ? "" : "s"} total.`}>
							{Object.entries(people).map(([person, cnt]) => (
								<div
									key={person}
									className="flex justify-between">
									<div>{capitalizeAll(person)}</div>
									<div>
										<span className="font-mono font-tabular">
											{cnt.toLocaleString()}
										</span>{" "}
										time{cnt === 1 ? "" : "s"}
									</div>
								</div>
							))}
						</Popup>
					);
				},
			},
		]
	);

	function Content(field: keyof FrequenciesStruct, index: number) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Frequency of {capitalize(field)}</CardTitle>
				</CardHeader>
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
		<Carousel
			className="mx-12"
			opts={{
				align: "start",
				loop: true,
			}}>
			<CarouselContent>
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
			</CarouselContent>
			<CarouselPrevious />
			<CarouselNext />
		</Carousel>
	);
}

export default Frequencies;
