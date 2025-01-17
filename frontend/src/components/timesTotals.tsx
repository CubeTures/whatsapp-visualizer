import { TimesKey } from "@/lib/types";
import TimesCard, { Props } from "./timesCard";
import { capitalize, numberToDate } from "@/lib/helpers";
import { useBundle, useFilters } from "@/hooks/context";
import { CarouselItem } from "./ui/carousel";
import { useMemo } from "react";
import Carousel from "./carousel";
import Header from "./header";

function TimesTotals() {
	const bundle = useBundle();
	const fields: TimesKey[] = ["hour", "weekday", "month", "year"];
	const [filters] = useFilters();

	type Data = {
		[x: string]: number | string;
	};

	type P = Props<Data, "__axis">;
	const data: P[] = useMemo(getData, [filters]);

	function getData(): P[] {
		let result = [];

		for (const field of fields) {
			result.push(getFieldProps(field));
		}

		return result;
	}

	function getFieldProps(field: TimesKey): P {
		return {
			title: `Total ${capitalize(filters.metric)} by ${capitalize(
				field
			)}`,
			desc: "TODO: desc",
			footer: "TODO: footer",
			data: getFieldData(field),
			dataKeys: Object.keys(bundle),
			axisNameKey: "__axis",
			field,
			tickFormatter: tickFormatter.bind(null, field),
		};
	}

	function getFieldData(field: TimesKey): Data[] {
		let result: Record<number, Data> = {};

		for (const [person, statistic] of Object.entries(bundle)) {
			if (field === "year") {
				for (const [year, counts] of Object.entries(
					statistic.counts_by_time[field]
				)) {
					const yr = parseInt(year);
					if (result[yr] === undefined) {
						result[yr] = {};
					}

					result[yr][person] = counts[filters.metric];
				}
			} else {
				for (
					let i = 0;
					i < statistic.counts_by_time[field].length;
					i++
				) {
					if (result[i] === undefined) {
						result[i] = {};
					}

					result[i][person] =
						statistic.counts_by_time[field][i][filters.metric];
				}
			}
		}

		return Object.entries(result)
			.sort(([a], [b]) => parseInt(a) - parseInt(b))
			.map(([key, val]) => {
				return {
					__axis: parseInt(key),
					...val,
				};
			});
	}

	function tickFormatter(field: TimesKey, value: string | number): string {
		return numberToDate(field, value as number);
	}

	return (
		<>
			<Header
				title="Totals by Time"
				desc="These are the same counts as before, divided up into hours, weekdays, months, and years. How has you communication stayed similar on a micro scale (by hour and by weekday) and how has it evolved over time (by month and by year)? Why do these trends exist? Change the metric in the navbar to see different graphs."
			/>
			<Carousel>
				{data.map((d, i) => (
					<CarouselItem
						key={i}
						className="lg:basis-1/2">
						<TimesCard {...d} />
					</CarouselItem>
				))}
			</Carousel>
		</>
	);
}

export default TimesTotals;
