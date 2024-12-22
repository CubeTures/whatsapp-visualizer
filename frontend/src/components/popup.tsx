import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "./ui/scroll-area";

interface Props {
	trigger: React.ReactNode;
	children: React.ReactNode;
	srOnly?: boolean;
	title?: React.ReactNode | string;
	desc?: React.ReactNode | string;
	footer?: React.ReactNode | string;
}

function Popup({ trigger, children, srOnly, title, desc, footer }: Props) {
	const cn = srOnly ? "sr-only" : "";

	return (
		<Dialog>
			<DialogTrigger asChild>{trigger}</DialogTrigger>
			<DialogContent
				className="overflow-hidden flex flex-col max-h-min"
				style={{ height: "calc(100dvh - 4rem)" }}>
				{(title || desc) && (
					<DialogHeader className={cn}>
						{title && <DialogTitle>{title}</DialogTitle>}
						{desc && <DialogDescription>{desc}</DialogDescription>}
					</DialogHeader>
				)}
				<ScrollArea className="-mr-4 pr-4 grow">{children}</ScrollArea>
				{footer && <DialogFooter>{footer}</DialogFooter>}
			</DialogContent>
		</Dialog>
	);
}

export default Popup;
