import { Bundle } from "@/lib/structures";
import { Filters } from "@/lib/types";
import { createContext, useContext } from "react";

export const BundleContext = createContext<Bundle | undefined>(undefined);

export const FilterContext = createContext<
	| [
			Filters | undefined,
			React.Dispatch<React.SetStateAction<Filters | undefined>>
	  ]
	| undefined
>(undefined);

export function useBundle() {
	// TODO: automatically restrict returned bundle based on the time selected
	const bundle = useContext(BundleContext);

	if (!bundle) {
		throw new Error("Bundle must be loaded before use.");
	}

	return bundle;
}

export function useFilters(): [Filters, (f: Partial<Filters>) => void] {
	const context = useContext(FilterContext);

	if (!context || context[0] === undefined || context[1] === undefined) {
		throw new Error("Filters must be loaded before use.");
	}

	const [filters, setFilters] = context;

	function set(f: Partial<Filters>) {
		setFilters({
			...filters,
			...f,
		});
	}

	return [filters, set];
}
