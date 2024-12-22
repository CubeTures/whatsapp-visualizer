import { CarouselItem } from "@/components/ui/carousel";
import CountCard, { Props } from "./countCard";
import { useBundle } from "@/hooks/context";
import { asFraction, capitalize, capitalizeAll } from "@/lib/helpers";
import { getAveragesFlavor } from "@/lib/countsFlavor";
import { AveragesKey } from "@/lib/types";
import {
	Formatter,
	NameType,
	ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import Carousel from "./carousel";

function CountsAverages() {
	const bundle = useBundle();

	const fields: AveragesKey[] = [
		"words",
		"letters",
		"emojis",
		"links",
		"media",
		"deleted",
		"edited",
	];

	interface Data {
		name: string;
		value: number;
		count: number;
		total: number;
	}

	const data: Props<Data>[] = getData();

	function getData(): Props<Data>[] {
		let result = [];

		for (const field of fields) {
			result.push(getFieldProps(field));
		}

		return result;
	}

	function getFieldProps(field: AveragesKey): Props<Data> {
		const name = capitalize(field);
		const { data, average } = getDataPoints(field);
		const flavor = getAveragesFlavor(bundle, field);

		return {
			title: `Average ${name}`,
			desc: flavor.description,
			footer: flavor.quip,

			metric: `${name}/Msg`,
			total: average,
			data,
			dataKey: "value",
			nameKey: "name",
		};
	}

	function getDataPoints(field: AveragesKey): {
		data: Data[];
		average: string;
	} {
		let result = [];
		let sum = 0;
		let total = 0;

		for (const [person, statistic] of Object.entries(bundle)) {
			const count = statistic.counts[field];
			const _total = statistic.counts.messages;
			const value = count / _total;
			sum += count;
			total += _total;

			result.push({
				name: capitalizeAll(person),
				value,
				count: count,
				total: _total,
			});
		}

		const average = asFraction(sum, total);

		return {
			data: result,
			average,
		};
	}

	const formatter: Formatter<ValueType, NameType> = (_, name, item) => (
		<>
			<div
				className="h-2.5 w-2.5 shrink-0 rounded-[2px] bg-[--color-bg]"
				style={
					{
						"--color-bg": `var(--color-${(name as string).replace(
							" ",
							"_"
						)})`,
					} as React.CSSProperties
				}
			/>

			<span className="text-muted-foreground">{name}</span>
			<div className="font-mono font-medium tabular-nums text-foreground">
				{asFraction(item.payload.count, item.payload.total)}
			</div>
		</>
	);

	return (
		<Carousel>
			{data.map((d, i) => (
				<CarouselItem
					key={i}
					className="md:basis-1/2 lg:basis-1/3 grid">
					<CountCard
						{...d}
						formatter={formatter}
					/>
				</CarouselItem>
			))}
		</Carousel>
	);
}

export default CountsAverages;
