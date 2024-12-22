import { HeaderContext } from "@tanstack/react-table";
import { Button } from "./ui/button";
import { ArrowUpDown } from "lucide-react";

function Sorter<T>(title: string, { column }: HeaderContext<T, unknown>) {
	return (
		<Button
			variant="ghost"
			onClick={() =>
				column.toggleSorting(column.getIsSorted() === "asc")
			}>
			{title}
			<ArrowUpDown className="ml-2 h-4 w-4" />
		</Button>
	);
}

export default Sorter;
