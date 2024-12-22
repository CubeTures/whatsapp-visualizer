import { useEffect, useState } from "react";
import {
	Carousel as Car,
	CarouselContent,
	CarouselNext,
	CarouselPrevious,
} from "./ui/carousel";

interface Props {
	children: React.ReactNode;
}

function Carousel({ children }: Props) {
	const [width, setWidth] = useState<number>(window.innerWidth);

	function handleWindowSizeChange() {
		setWidth(window.innerWidth);
	}
	useEffect(() => {
		window.addEventListener("resize", handleWindowSizeChange);
		return () => {
			window.removeEventListener("resize", handleWindowSizeChange);
		};
	}, []);

	const isMobile = width <= 640;

	return (
		<Car
			className="sm:mx-12"
			opts={{
				align: "start",
				loop: true,
			}}>
			<CarouselContent>{children}</CarouselContent>
			{!isMobile && (
				<>
					<CarouselPrevious />
					<CarouselNext />
				</>
			)}
		</Car>
	);
}

export default Carousel;
