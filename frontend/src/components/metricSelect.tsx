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

import { Counts } from "@/lib/structures";
import { capitalize } from "@/lib/helpers";
import { useFilters } from "@/hooks/context";

function MetricSelect() {
	const [filters, setFilters] = useFilters();

	const metrics: (keyof Counts)[] = [
		"messages",
		"words",
		"letters",
		"emojis",
		"links",
		"media",
		"calls",
		"deleted",
		"edited",
	];

	function setMetric(metric: keyof Counts) {
		setFilters({ metric });
	}

	return (
		<Select
			value={filters.metric}
			onValueChange={setMetric}>
			<SelectTrigger className="w-[180px]">
				<SelectValue
					placeholder={capitalize(metrics[0])}
					defaultValue={metrics[0]}
				/>
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					<SelectLabel>Metrics</SelectLabel>
					<SelectSeparator />
					{metrics.map((metric, i) => (
						<SelectItem
							value={metric}
							key={i}>
							{capitalize(metric)}
						</SelectItem>
					))}
				</SelectGroup>
			</SelectContent>
		</Select>
	);
}

export default MetricSelect;
