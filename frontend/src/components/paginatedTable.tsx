import {
	ColumnDef,
	ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	PaginationState,
	SortingState,
	useReactTable,
} from "@tanstack/react-table";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "./ui/table";
import { Button } from "./ui/button";
import { useMemo, useState } from "react";
import { Input } from "./ui/input";
import { TableFilter } from "@/lib/types";
import { Label } from "./ui/label";

interface Props<T> extends React.HTMLAttributes<HTMLDivElement> {
	data: T[];
	columns: ColumnDef<T, any>[];
	filters?: TableFilter<T>[];
}

function PaginatedTable<T>({ data, columns, filters, ...rest }: Props<T>) {
	const [pageIndex, setPageIndex] = useState("1");
	const [pagination, setPagination] = useState<PaginationState>({
		pageIndex: 0,
		pageSize: 5,
	});
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		onPaginationChange: setPagination,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		state: {
			sorting,
			columnFilters,
			pagination,
		},
	});

	function Filter() {
		return (
			filters && (
				<div className="flex flex-col gap-4 mb-4">
					{filters.map((filter, index) => (
						<div
							className="flex items-center"
							key={index}>
							<Input
								placeholder={`Filter ${filter.name}...`}
								value={
									(table
										.getColumn(filter.columnKey as string)
										?.getFilterValue() as string) ?? ""
								}
								onChange={(event) => {
									table
										.getColumn(filter.columnKey as string)
										?.setFilterValue(event.target.value);

									setPageIndex("1");
								}}
							/>
						</div>
					))}
				</div>
			)
		);
	}

	function Header() {
		return (
			<TableHeader>
				{table.getHeaderGroups().map((headerGroup) => (
					<TableRow key={headerGroup.id}>
						{headerGroup.headers.map((header) => {
							return (
								<TableHead key={header.id}>
									{header.isPlaceholder
										? null
										: flexRender(
												header.column.columnDef.header,
												header.getContext()
										  )}
								</TableHead>
							);
						})}
					</TableRow>
				))}
			</TableHeader>
		);
	}

	function Body() {
		return (
			<TableBody>
				{table.getRowModel().rows?.length ? (
					table.getRowModel().rows.map((row) => (
						<TableRow
							key={row.id}
							data-state={row.getIsSelected() && "selected"}>
							{row.getVisibleCells().map((cell) => (
								<TableCell key={cell.id}>
									{flexRender(
										cell.column.columnDef.cell,
										cell.getContext()
									)}
								</TableCell>
							))}
						</TableRow>
					))
				) : (
					<TableRow>
						<TableCell
							colSpan={columns.length}
							className="h-24 text-center">
							No results.
						</TableCell>
					</TableRow>
				)}
			</TableBody>
		);
	}

	function Page() {
		return (
			<div className="flex items-center justify-between space-x-2 pt-4">
				<div className="space-x-2">
					<Button
						variant="outline"
						size="sm"
						onClick={() => {
							table.firstPage();
							setPageIndex("1");
						}}
						disabled={!table.getCanPreviousPage()}>
						First
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => {
							table.previousPage();
							setPageIndex(
								`${table.getState().pagination.pageIndex}`
							);
						}}
						disabled={!table.getCanPreviousPage()}>
						Previous
					</Button>
				</div>
				<div className="grid items-center grid-cols-2 space-x-2">
					<Input
						value={pageIndex}
						onChange={(e) => {
							const page = e.target.value
								? Number(e.target.value)
								: 0;

							setPageIndex(page === 0 ? "" : `${page}`);
							table.setPageIndex(page - 1);
						}}
						min={1}
						max={table.getPageCount() + 1}
						id={"page"}
						type="number"
					/>
					<Label
						htmlFor={"page"}>{`/ ${table.getPageCount()}`}</Label>
				</div>
				<div className="space-x-2">
					<Button
						variant="outline"
						size="sm"
						onClick={() => {
							table.nextPage();
							setPageIndex(
								`${table.getState().pagination.pageIndex + 2}`
							);
						}}
						disabled={!table.getCanNextPage()}>
						Next
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => {
							table.lastPage();
							setPageIndex(`${table.getPageCount()}`);
						}}
						disabled={!table.getCanNextPage()}>
						Last
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div {...rest}>
			{Filter()}
			<div className="rounded border">
				<Table>
					{Header()}
					{Body()}
				</Table>
			</div>
			{Page()}
		</div>
	);
}

export default PaginatedTable;
