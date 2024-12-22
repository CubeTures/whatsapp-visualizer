interface Props {
	children?: React.ReactNode;
}

function Container({ children }: Props) {
	return (
		<div className="flex justify-center w-full p-4">
			<div className="flex flex-col gap-4 w-full lg:max-w-screen-lg">
				{children}
			</div>
		</div>
	);
}

export default Container;
