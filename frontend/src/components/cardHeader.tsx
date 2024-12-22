import { Info } from "lucide-react";
import { CardTitle, CardHeader as Header } from "./ui/card";
import { Button } from "./ui/button";
import Popup from "./popup";

interface Props {
	title: string | React.ReactNode;
	desc?: string | React.ReactNode;
}

function CardHeader({ title, desc }: Props) {
	return (
		<Header>
			<CardTitle>
				{desc ? (
					<div className="flex flex-wrap flex-row-reverse justify-between items-center">
						<Popup
							srOnly
							title={title}
							desc={`Info about ${title}`}
							trigger={
								<Button
									variant={"ghost"}
									aria-hidden
									className="-mr-4">
									<Info />
								</Button>
							}>
							{desc}
						</Popup>
						<div>{title}</div>
					</div>
				) : (
					title
				)}
			</CardTitle>
		</Header>
	);
}

export default CardHeader;
