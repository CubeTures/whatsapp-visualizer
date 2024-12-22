import * as React from "react";
import { Label, Pie, PieChart } from "recharts";
import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "./ui/card";
import { ContentType } from "recharts/types/component/Label";
import { DataKey } from "recharts/types/util/types";
import { chartColor, isNumber } from "@/lib/helpers";
import {
	Formatter,
	NameType,
	ValueType,
} from "recharts/types/component/DefaultTooltipContent";

export interface Props<T> {
	title: string;
	desc: string;
	footer: string;

	data: T[];
	dataKey: keyof T;
	nameKey: keyof T;

	metric: string;
	total?: string;
	formatter?: Formatter<ValueType, NameType>;
}

function CountCard<T>({
	title,
	desc,
	footer,
	data,
	dataKey,
	nameKey,
	metric,
	total,
	formatter,
}: Props<T>) {
	function chartConfig(): ChartConfig {
		let config: any = {};

		for (let i = 0; i < data.length; i++) {
			const name = dataName(i);
			config[name] = {
				label: name,
				color: chartColor(i),
			};
		}

		return config;
	}

	function chartData(): (T & { fill: string })[] {
		let result: any = data;

		for (let i = 0; i < data.length; i++) {
			const name = dataName(i);
			result[i]["fill"] = `var(--color-${name})`;
		}

		return result;
	}

	function dataName(i: number): string {
		return (data[i][nameKey] as string).replace(" ", "_");
	}

	const centerValue =
		total !== undefined
			? total
			: React.useMemo(() => {
					return data
						.reduce((acc, curr) => acc + getValue(curr), 0)
						.toLocaleString(undefined, {
							notation: "compact",
							compactDisplay: "short",
						});
			  }, [data]);

	function getValue(d: T): number {
		const value = d[dataKey];

		if (!isNumber(value)) {
			throw new Error("Data must be number.");
		}

		return value;
	}

	const labelContent: ContentType = ({ viewBox }) => {
		if (viewBox && "cx" in viewBox && "cy" in viewBox) {
			return (
				<text
					x={viewBox.cx}
					y={viewBox.cy}
					textAnchor="middle"
					dominantBaseline="middle">
					<tspan
						x={viewBox.cx}
						y={viewBox.cy}
						className="fill-foreground text-3xl font-bold">
						{centerValue}
					</tspan>
					<tspan
						x={viewBox.cx}
						y={(viewBox.cy || 0) + 24}
						className="fill-muted-foreground">
						{metric}
					</tspan>
				</text>
			);
		}
	};

	function CountPie() {
		return (
			<ChartContainer
				config={chartConfig()}
				className="mx-auto aspect-square max-h-[250px]">
				<PieChart>
					<ChartTooltip
						cursor={false}
						content={
							<ChartTooltipContent
								hideLabel
								formatter={formatter}
							/>
						}
					/>
					<Pie
						data={chartData()}
						dataKey={dataKey as DataKey<T>}
						nameKey={nameKey as DataKey<T>}
						innerRadius={60}>
						<Label content={labelContent} />
					</Pie>
				</PieChart>
			</ChartContainer>
		);
	}

	return (
		<Card className="grid grid-rows-subgrid row-span-3">
			<CardHeader>
				<CardTitle>{title}</CardTitle>
				<CardDescription>{desc}</CardDescription>
			</CardHeader>
			<CardContent>
				<CountPie />
			</CardContent>
			<CardFooter>
				<p dangerouslySetInnerHTML={{ __html: footer }}></p>
			</CardFooter>
		</Card>
	);
}

export default CountCard;
