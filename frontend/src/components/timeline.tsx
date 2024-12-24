import { Area, AreaChart, Brush, XAxis } from "recharts";
import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import { useBundle, useFilters } from "@/hooks/context";
import { useMemo, useState } from "react";
import { capitalize, chartColor, prettyDate } from "@/lib/helpers";
import {
	differenceInDays,
	differenceInMonths,
	differenceInYears,
	subMonths,
	subYears,
} from "date-fns";
import Header from "./header";

export function Timeline() {
	const bundle = useBundle();
	const [filters,] = useFilters();

	type Data = { [x: string]: number | Date };

	const [minMax, setMinMax] = useState<{ min: Date; max: Date }>({
		min: new Date(),
		max: new Date(),
	});
	const data: Data[] = useMemo(getData, [filters]);

	function getData(): Data[] {
		let result: Record<string, Data> = {};
		let min: Date | undefined = undefined;
		let max: Date | undefined = undefined;

		for (const [person, statistics] of Object.entries(bundle)) {
			for (const [year, monthMap] of Object.entries(
				statistics.counts_by_time.exact
			)) {
				for (const [month, dayMap] of Object.entries(monthMap)) {
					for (const [day, hourMap] of Object.entries(dayMap)) {
						for (const [hour, counts] of Object.entries(hourMap)) {
							const date = new Date(
								parseInt(year),
								parseInt(month),
								parseInt(day),
								parseInt(hour)
							);

							if (min === undefined || date < min) {
								min = date;
							}
							if (max === undefined || date > max) {
								max = date;
							}

							const str = date.toDateString();
							if (result[str] === undefined) {
								result[str] = {
									date,
								};
							}

							const pr = person.replace(" ", "_");
							result[str][pr] = counts[filters.metric];
						}
					}
				}
			}
		}

		setMinMax({ min: min as Date, max: max as Date });
		return Object.values(result);
	}

	const config = useMemo(chartConfig, [filters]);
	function chartConfig(): ChartConfig {
		let config: any = {};

		const keys = Object.keys(bundle);
		for (let i = 0; i < keys.length; i++) {
			const name = keys[i].replace(" ", "_");
			config[name] = {
				label: keys[i],
				color: chartColor(i),
			};
		}

		return config;
	}

	function getTotalTime(): string {
		const min = minMax.min;
		const max = minMax.max;

		const y = differenceInYears(max, min);
		const m = differenceInMonths(subYears(max, y), min);
		const d = differenceInDays(subMonths(subYears(max, y), m), min);

		const _y =
			y === 0
				? ""
				: `${y} year${y === 1 ? "" : "s"}${
						m === 0 && d === 0
							? ""
							: m === 0 || d === 0
							? " and"
							: ","
				  } `;
		const _m =
			m === 0
				? ""
				: `${m} month${m === 1 ? "" : "s"}${
						d == 0 ? "" : y === 0 ? " and" : ", and"
				  } `;
		const _d = d === 0 ? "" : `${d} day${d === 1 ? "" : "s"} `;

		return `${_y}${_m}${_d}`;
	}

	return (
		<>
			<Header
				title={`${capitalize(filters.metric)} History`}
				desc={`This is your entire chat history. All ${getTotalTime()}of it. It's hard to think how such rich history can be distilled into a single graph. There's times when you spoke a lot, and there's times when you didn't speak at all. Look at the peaks and the valleys. Can you remember what happened those days? Use the brush at the bottom to pan the history. Change the metric in the navbar to see different graphs.`}
			/>
			<ChartContainer
				config={config}
				className="h-[200px] w-full">
				<AreaChart
					accessibilityLayer
					data={data}
					margin={{
						left: 12,
						right: 12,
					}}>
					<XAxis
						dataKey="date"
						tickLine={false}
						axisLine={false}
						tickMargin={8}
						tickFormatter={(date) => prettyDate(date, true)}
					/>
					<ChartTooltip
						content={
							<ChartTooltipContent
								labelKey="date"
								labelFormatter={(_, payload) => {
									return prettyDate(payload[0].payload.date);
								}}
								indicator="dot"
							/>
						}
					/>
					{Object.keys(config).map((person) => (
						<Area
							key={person}
							dataKey={person}
							type="monotoneX"
							fill={`var(--color-${person})`}
							fillOpacity={0.4}
							stroke={`var(--color-${person})`}
							stackId={"a"}
						/>
					))}
					<Brush
						className="text-foreground"
						dataKey="date"
						tickFormatter={(date) => prettyDate(date)}
						stroke={"hsl(var(--muted-foreground))"}
						fill={"hsl(var(--background))"}
					/>
				</AreaChart>
			</ChartContainer>
		</>
	);
}
