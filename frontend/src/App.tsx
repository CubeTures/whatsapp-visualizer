import "./App.css";
import Container from "./components/container";
import { BundleContext, FilterContext } from "./hooks/context";
import { useEffect, useState } from "react";
import { Bundle } from "./lib/structures";
import chat from "./data/RealChatExport.chat.json";
import { Filters } from "./lib/types";
import Longest from "./components/longest";
import Nav from "./components/nav";
import StatisticTabs from "./components/statisticTabs";
import Frequencies from "./components/frequencies";

function App() {
	const [data, setData] = useState<Bundle | undefined>(undefined);
	const [filters, setFilters] = useState<Filters | undefined>(undefined);

	useEffect(() => {
		const bundle = chat as Bundle;

		setFilters({
			people: Object.keys(bundle.personal),
			statistic: "totals",
			metric: "messages",
			start: new Date(),
			end: new Date(),
		});

		setData(bundle);
	}, []);

	return (
		<div className="pb-4">
			<BundleContext.Provider value={data}>
				<FilterContext.Provider value={[filters, setFilters]}>
					{data && filters && <Nav />}
					<Container>
						{data ? (
							<>
								<StatisticTabs />
								<Frequencies />
							</>
						) : (
							<h1>Loading...</h1>
						)}
					</Container>
				</FilterContext.Provider>
			</BundleContext.Provider>
		</div>
	);
}

export default App;
