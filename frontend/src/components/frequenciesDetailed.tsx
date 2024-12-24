import { Frequencies } from "@/lib/structures";
import { singular, Frequency } from "./frequencies";
import { CellContext, ColumnDef } from "@tanstack/react-table";
import PaginatedTable from "./paginatedTable";
import {
	capitalize,
	capitalizeAll,
	decapitalize,
} from "@/lib/helpers";
import { Button } from "./ui/button";
import { Eye } from "lucide-react";
import Popup from "./popup";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "./ui/accordion";
import { useMemo } from "react";
import Sorter from "./sorter";

interface Props {
	field: keyof Frequencies;
	cell: CellContext<Frequency, unknown>;
}

function FrequenciesDetailed({ field, cell: { row } }: Props) {
	const content = row.getValue<string>("content");
	const rank = row.getValue<number>("rank");
	const count = row.getValue<number>("count");
	const people = row.getValue<Record<string, Date[]>>("people");

	interface Data {
		date: Date;
		count: number;
	}

	const data: Record<string, Data[]> = useMemo(getData, [row]);

	function getData(): Record<string, Data[]> {
		let result: Record<string, Data[]> = {};

		for (const [person, dates] of Object.entries(people)) {
			result[person] = collapseDates(dates);
		}

		return result;
	}

	function collapseDates(dates: Date[]): Data[] {
		let result: Record<string, Data> = {};

		for (const date of dates) {
			const str = date.toDateString();
			if (result[str] === undefined) {
				result[str] = {
					date: date,
					count: 1,
				};
			} else {
				result[str].count++;
			}
		}

		return Object.values(result);
	}

	const columns: Record<string, ColumnDef<Data>[]> = Object.fromEntries(
		Object.keys(people).map((person): [string, ColumnDef<Data>[]] => [
			person,
			[
				{
					accessorKey: "date",
					header: (props) => Sorter("Date", props),
					cell: ({ row }) => {
						const date = row.getValue<Date>("date");
						return <div>{date.toDateString()}</div>;
					},
				},
				{
					accessorKey: "count",
					header: (props) => Sorter("Count", props),
					cell: ({ row }) => {
						const count = row.getValue<number>("count");
						return (
							<div className="font-mono font-tabular">
								{count.toLocaleString()}
							</div>
						);
					},
				},
			],
		])
	);

	const trigger = (
		<Button variant="ghost">
			<Eye className="h-4 w-4" />
		</Button>
	);

	function DateTable(person: string) {
		return (
			<PaginatedTable
				data={data[person]}
				columns={columns[person]}
			/>
		);
	}

	function AccordionContents() {
		return Object.entries(people).map(([person, dates], index) => (
			<AccordionItem
				value={`${person}-${index}`}
				key={`${person}-${index}`}>
				<AccordionTrigger className="flex justify-end gap-2">
					<div className="grow self-start text-left">
						{capitalizeAll(person)}
					</div>
					<div>
						<span className="font-mono font-tabular">
							{dates.length.toLocaleString()}
						</span>{" "}
						time{dates.length === 1 ? "" : "s"}
					</div>
				</AccordionTrigger>
				<AccordionContent className="flex flex-wrap gap-2">
					{DateTable(person)}
				</AccordionContent>
			</AccordionItem>
		));
	}

	return (
		<Popup
			trigger={trigger}
			title={`#${rank.toLocaleString()} Most Used ${singular[field]}`}
			desc={`The ${decapitalize(singular[field])} "${
				field === "words" ? capitalize(content) : content
			}" was used ${count.toLocaleString()} time${
				count === 1 ? "" : "s"
			} total.`}>
			<Accordion
				type="single"
				collapsible
				className="w-full">
				{AccordionContents()}
			</Accordion>
		</Popup>
	);
}

export default FrequenciesDetailed;
