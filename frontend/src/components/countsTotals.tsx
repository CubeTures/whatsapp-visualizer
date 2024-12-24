import { CarouselItem } from "@/components/ui/carousel";
import CountCard, { Props } from "./countCard";
import { useBundle } from "@/hooks/context";
import { Counts as CountsStruct } from "@/lib/structures";
import { capitalize, capitalizeAll } from "@/lib/helpers";
import { getCountsFlavor } from "@/lib/countsFlavor";
import Carousel from "./carousel";
import Header from "./header";

function CountsTotals() {
	const bundle = useBundle();

	const fields: (keyof CountsStruct)[] = [
		"messages",
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
	}

	const data: Props<Data>[] = getData();

	function getData(): Props<Data>[] {
		let result = [];

		for (const field of fields) {
			result.push(getFieldProps(field));
		}

		return result;
	}

	function getFieldProps(field: keyof CountsStruct): Props<Data> {
		const name = capitalize(field);
		const points = getDataPoints(field);
		const flavor = getCountsFlavor(bundle, field);

		return {
			title: `Total ${name}`,
			desc: flavor.description,
			footer: flavor.quip,

			metric: name,
			data: points,
			dataKey: "value",
			nameKey: "name",
		};
	}

	function getDataPoints(field: keyof CountsStruct): Data[] {
		let result = [];

		for (const [person, statistic] of Object.entries(bundle)) {
			result.push({
				name: capitalizeAll(person),
				value: statistic.counts[field],
			});
		}

		return result;
	}

	return (
		<>
			<Header
				title={"Total Counts"}
				desc="These are your total counts. Every message, emoji, and link
					is accounted for. Who sent the most? Did that align with
					your expectations? Why or why not? See the averages for
					these counts by changing the statistic in the navbar."
			/>
			<Carousel>
				{data.map((d, i) => (
					<CarouselItem
						key={i}
						className="md:basis-1/2 lg:basis-1/3 grid">
						<CountCard {...d} />
					</CarouselItem>
				))}
			</Carousel>
		</>
	);
}

export default CountsTotals;
