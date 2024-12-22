// a stacked bar chart where you can choose what count (messages, words, letters) and toggle people to be included

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import { chartColor, numberToDate } from "@/lib/helpers";
import { DataKey } from "recharts/types/util/types";
import {
	Formatter,
	NameType,
	Payload,
	ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import { TimesKey } from "@/lib/types";

export interface Props<T, K extends keyof T> {
	title: string;
	desc: string;
	footer: string;

	data: T[];
	dataKeys: (keyof T)[];
	axisNameKey: K;

	field: TimesKey;
	tickFormatter?: (value: T[K], index: number) => string;
}

function TimesCard<T, K extends keyof T>({
	title,
	desc,
	footer,
	data,
	dataKeys,
	axisNameKey,
	field,
	tickFormatter,
}: Props<T, K>) {
	type Layout = "horizontal" | "vertical";
	const layout: Layout = "horizontal";

	function chartConfig(): ChartConfig {
		let config: any = {};

		for (let i = 0; i < dataKeys.length; i++) {
			const name = (dataKeys[i] as string).replace(" ", "_");

			config[name] = {
				label: name,
				color: chartColor(i),
			};
		}

		return config;
	}

	function getRadius(
		index: number,
		arr: any[]
	): [number, number, number, number] | undefined {
		if (index === 0) {
			return layout === "horizontal" ? [0, 0, 4, 4] : [4, 0, 0, 4];
		} else if (index === arr.length - 1) {
			return layout === "horizontal" ? [4, 4, 0, 0] : [0, 4, 4, 0];
		} else {
			return undefined;
		}
	}

	const labelFormatter: (
		label: number,
		payload: Payload<ValueType, NameType>[]
	) => any = (_, payload) => {
		return numberToDate(field, payload[0].payload.__axis, "long");
	};

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
			<div className="ml-auto font-mono font-medium tabular-nums text-foreground">
				{(item.payload[name as number] as number).toLocaleString()}
			</div>
		</>
	);

	function getTotal(payload: Payload<ValueType, NameType>[]): string {
		return Object.entries(payload[0].payload)
			.filter(([key, _]) => key !== axisNameKey)
			.reduce((acc, curr) => acc + parseInt(curr[1] as string), 0)
			.toLocaleString();
	}

	const totalFormatter = (payload: Payload<ValueType, NameType>[]) => (
		<div className="flex items-center border-t pt-1.5 text-xs font-medium text-foreground">
			Total
			<div className="ml-auto flex items-baseline font-mono font-medium tabular-nums text-foreground">
				{getTotal(payload)}
			</div>
		</div>
	);

	function StackedBarChart() {
		return (
			<ChartContainer config={chartConfig()}>
				<BarChart
					accessibilityLayer
					data={data}
					layout="horizontal">
					{layout === "vertical" ? (
						<>
							<XAxis
								type="number"
								hide
							/>
							<YAxis
								dataKey={axisNameKey as DataKey<T>}
								type="category"
								tickLine={false}
								tickMargin={10}
								axisLine={false}
								tickFormatter={tickFormatter}
							/>
						</>
					) : (
						<XAxis
							dataKey={axisNameKey as DataKey<T>}
							type="category"
							tickLine={false}
							tickMargin={10}
							axisLine={false}
							tickFormatter={tickFormatter}
						/>
					)}

					<ChartTooltip
						content={
							<ChartTooltipContent
								labelFormatter={labelFormatter}
								formatter={formatter}
								totalFormatter={totalFormatter}
							/>
						}
					/>
					{dataKeys.map((value, index, arr) => (
						<Bar
							key={`${value as string}_${index}`}
							dataKey={value as DataKey<T>}
							fill={`var(--color-${(value as string).replace(
								" ",
								"_"
							)})`}
							radius={getRadius(index, arr)}
							stackId={"a"}
						/>
					))}
				</BarChart>
			</ChartContainer>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>{title}</CardTitle>
				<CardDescription>{desc}</CardDescription>
			</CardHeader>
			<CardContent>{StackedBarChart()}</CardContent>
			<CardFooter>{footer}</CardFooter>
		</Card>
	);
}

export default TimesCard;
