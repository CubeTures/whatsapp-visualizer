import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectSeparator,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

import { capitalize } from "@/lib/helpers";
import { useFilters } from "@/hooks/context";
import { Statistic } from "@/lib/types";

function StatisticSelect() {
	const [filters, setFilters] = useFilters();

	const statistics: Statistic[] = ["totals", "averages"];

	function setStatistic(statistic: Statistic) {
		setFilters({ statistic });
	}

	return (
		<Select
			value={filters.statistic}
			onValueChange={setStatistic}>
			<SelectTrigger className="w-[180px]">
				<SelectValue
					placeholder={capitalize(statistics[0])}
					defaultValue={statistics[0]}
				/>
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					<SelectLabel>Statistics</SelectLabel>
					<SelectSeparator/>
					{statistics.map((stat, i) => (
						<SelectItem
							value={stat}
							key={i}>
							{capitalize(stat)}
						</SelectItem>
					))}
				</SelectGroup>
			</SelectContent>
		</Select>
	);
}

export default StatisticSelect;
