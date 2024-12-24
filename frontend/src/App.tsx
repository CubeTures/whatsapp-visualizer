import "./App.css";
import Container from "./components/container";
import { BundleContext, FilterContext } from "./hooks/context";
import { useEffect, useState } from "react";
import { Bundle } from "./lib/structures";
import { Filters } from "./lib/types";
import Nav from "./components/nav";
import StatisticTabs from "./components/statisticTabs";
import Frequencies from "./components/frequencies";
import { Timeline } from "./components/timeline";
import Header from "./components/header";
import Loader from "./components/loader";

function App() {
	const [data, setData] = useState<Bundle | undefined>(undefined);
	const [filters, setFilters] = useState<Filters | undefined>(undefined);

	useEffect(() => {
		if (data !== undefined) {
			setFilters({
				people: Object.keys(data),
				statistic: "totals",
				metric: "messages",
				start: new Date(),
				end: new Date(),
			});
		}
	}, [data]);

	return (
		<div className="pb-4">
			<BundleContext.Provider value={data}>
				<FilterContext.Provider value={[filters, setFilters]}>
					{data && filters && <Nav />}
					<Container>
						{data && filters ? (
							<>
								<Timeline />
								<StatisticTabs />
								<Frequencies />
								<Header
									title="Thank you"
									desc="Thank you for using WhatsApp Visualizer. I hope you were able to better appreciate the chat history you have with your friends and loved ones. Remember to treasure those in your life, as they unlike these numbers presented here, they are not just a statistic -- they are real people."
								/>
							</>
						) : (
							<Loader setData={setData} />
						)}
					</Container>
				</FilterContext.Provider>
			</BundleContext.Provider>
		</div>
	);
}

export default App;
