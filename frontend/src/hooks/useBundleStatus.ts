import { useEffect, useState } from "react";

Object.defineProperty(window, "BundleStatus", {
	set(value) {
		this._bundleStatus = value;
		const event = new CustomEvent("BundleStatusChanged", { detail: value });
		window.dispatchEvent(event);
	},
	get() {
		return this._bundleStatus;
	},
});

export function useBundleStatus() {
	const [bundleStatus, setBundleStatus] = useState<string>("");

	useEffect(() => {
		const handleStatusChange = (event: CustomEvent) => {
			setBundleStatus(event.detail);
		};

		// Add event listener
		window.addEventListener(
			"BundleStatusChanged",
			handleStatusChange as EventListener
		);

		// Set initial value
		setBundleStatus(window.BundleStatus || "");

		return () => {
			// Cleanup event listener
			window.removeEventListener(
				"BundleStatusChanged",
				handleStatusChange as EventListener
			);
		};
	}, []);

	return bundleStatus;
}
