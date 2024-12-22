import MetricSelect from "./metricSelect";
import StatisticSelect from "./statisticSelect";

function Nav() {
	return (
		<div
			className="sticky top-0 w-full flex justify-center z-20 bg-background/80 border-b border-b-border"
			style={{ backdropFilter: "blur(10px)" }}>
			<div className="flex justify-between items-center gap-4 max-w-screen-lg w-full p-2 px-6">
				<h1 className="text-xl font-semibold underline decoration-primary">
					WhatsApp Visualizer
				</h1>
				<div className="flex gap-6">
					<StatisticSelect />
					<MetricSelect />
				</div>
			</div>
		</div>
	);
}

export default Nav;
