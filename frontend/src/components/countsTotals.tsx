import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import CountCard, { Props } from "./countCard";
import { useBundle } from "@/hooks/context";
import { Counts as CountsStruct } from "@/lib/structures";
import { capitalize, capitalizeAll } from "@/lib/helpers";
import { getCountsFlavor } from "@/lib/countsFlavor";

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
		const flavor = getCountsFlavor(bundle.personal, field);

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

		for (const [person, statistic] of Object.entries(bundle.personal)) {
			result.push({
				name: capitalizeAll(person),
				value: statistic.counts[field],
			});
		}

		return result;
	}

	return (
		<Carousel
			opts={{
				align: "start",
				loop: true,
			}}
			className="mx-12">
			<CarouselContent>
				{data.map((d, i) => (
					<CarouselItem
						key={i}
						className="md:basis-1/2 lg:basis-1/3 grid">
						<CountCard {...d} />
					</CarouselItem>
				))}
			</CarouselContent>
			<CarouselPrevious />
			<CarouselNext />
		</Carousel>
	);
}

export default CountsTotals;
