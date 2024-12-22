import { useFilters } from "@/hooks/context";
import { Tabs, TabsContent } from "./ui/tabs";
import CountsTotals from "./countsTotals";
import TimesTotals from "./timesTotals";
import CountsAverages from "./countsAverages";

function StatisticTabs() {
	const [filters] = useFilters();

	return (
		<Tabs
			value={filters.statistic}
			defaultValue={filters.statistic}>
			<TabsContent value="totals" className="flex flex-col gap-4 mt-0">
				<CountsTotals />
				<TimesTotals />
			</TabsContent>
			<TabsContent value="averages" className="flex flex-col gap-4 mt-0">
				<CountsAverages />
			</TabsContent>
		</Tabs>
	);
}

export default StatisticTabs;
