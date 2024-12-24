import { ColumnDef } from "@tanstack/react-table";
import { useBundle } from "@/hooks/context";
import PaginatedTable from "./paginatedTable";
import { useMemo, useState } from "react";
import { Button } from "./ui/button";
import { Eye } from "lucide-react";
import Popup from "./popup";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import Sorter from "./sorter";
import { prettyDate } from "@/lib/helpers";

function Longest() {
	const bundle = useBundle();

	interface Message {
		sender: string;
		rank: number;
		date: Date;
		message: string;
		length: number;
	}

	const data = useMemo(getData, [bundle]);

	function getData(): Message[] {
		let result: Message[] = [];

		for (const [person, statistic] of Object.entries(bundle)) {
			for (const msg of statistic.lengths.longest_messages) {
				result.push({
					...msg,
					sender: person,
					rank: -1,
					date: new Date(msg.date),
				});
			}
		}

		return result
			.sort((a, b) => {
				const len = b.length - a.length;
				return len === 0 ? a.sender.localeCompare(b.sender) : len;
			})
			.map((a, i) => ({ ...a, rank: i + 1 }));
	}

	const columns: ColumnDef<Message>[] = [
		{
			accessorKey: "rank",
			header: "Rank",
		},
		{
			accessorKey: "sender",
			header: (props) => Sorter("Sender", props),
		},
		{
			accessorKey: "length",
			header: (props) => Sorter("Length", props),
			cell: ({ row }) => {
				const value = row.getValue<number>("length").toLocaleString();

				return (
					<div className="font-mono font-medium tabular-nums">
						{value}
					</div>
				);
			},
		},
		{
			accessorKey: "date",
			header: (props) => Sorter("Date", props),
			cell: ({ row }) => row.getValue<Date>("date").toDateString(),
		},
		{
			accessorKey: "message",
			header: "Message",
			cell: ({ row }) => {
				const message = row.getValue<string>("message");
				const rank = row.getValue<number>("rank");
				const date = data[rank - 1].date;
				const sender = row.getValue<string>("sender");
				const length = row.getValue<number>("length").toLocaleString();

				const trigger = (
					<Button variant="ghost">
						<Eye className="h-4 w-4" />
					</Button>
				);

				return (
					<Popup
						trigger={trigger}
						title={`#${rank} Longest Message`}
						desc={`Message from ${sender} at ${prettyDate(
							date
						)} with ${length} words.`}>
						{message}
					</Popup>
				);
			},
		},
	];

	const [terms, setTerms] = useState(false);

	function Check() {
		return (
			<div className="flex flex-col gap-4">
				<p className="border-l-4 border-l-destructive rounded p-2 px-4 bg-destructive/30">
					<span className="font-bold">Note</span>: Long messages are
					often accompanied by strong emotions -- both good and bad.
					Make sure you're in a position where you're ok with seeing
					that before you look at any of the following messages.
				</p>
				<Button
					className="self-center"
					variant={"destructive"}
					onClick={() => setTerms(true)}>
					I understand, show me anyway
				</Button>
			</div>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex justify-between items-center">
					<span>Longest Messages</span>
					{terms && (
						<Button
							variant="destructive"
							onClick={() => setTerms(false)}>
							Hide
						</Button>
					)}
				</CardTitle>
			</CardHeader>
			<CardContent>
				{terms ? (
					<PaginatedTable
						data={data}
						columns={columns}
					/>
				) : (
					Check()
				)}
			</CardContent>
		</Card>
	);
}

export default Longest;
