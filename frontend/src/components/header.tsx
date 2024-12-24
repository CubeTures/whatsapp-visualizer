interface Props {
	title: string;
	desc: string;
}

function Header({ title, desc }: Props) {
	return (
		<div className="border p-6 rounded">
			<h1 className="font-semibold text-2xl">{title}</h1>
			<p className="text-muted-foreground text-sm">{desc}</p>
		</div>
	);
}

export default Header;
