"use client";

import {
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RangeFilter } from "@/filters/RangeFilterPopover";
import { TextFilter } from "@/filters/TextFilterPopover";

import { getColumnFilter } from "./ColumnFilter";
import { columns } from "./columns";
import { MovieResponse } from "./model";

// TODO: which filters belong to type "string" category (e.g. 'title')
const updateUrl = (filterName: string, value: RangeFilter | TextFilter) => {
  const currentSearch = window.location.search;
  const url = new URLSearchParams(currentSearch);
  // unless filter is already applied
  if (!url.get(filterName)) {
    if (typeof value === "string") {
      url.append(filterName, `${value}`);
    } else if ("min" in value && "max" in value) {
      const min = parseFloat(value.min ?? "");
      const max = parseFloat(value.max ?? "");
      if (Number.isFinite(min)) {
        url.append(filterName, `min:${min}`);
      }
      if (Number.isFinite(max)) {
        url.append(filterName, `max:${max}`);
      }
    }
  } else {
    // need to update it
    if (typeof value === "string") {
      url.set(filterName, `${value}`);
    } else if ("min" in value && "max" in value) {
      url.delete(filterName);
      const min = parseFloat(value.min ?? "");
      const max = parseFloat(value.max ?? "");
      if (Number.isFinite(min)) {
        url.set(filterName, `min:${min}`);
      }
      if (Number.isFinite(max)) {
        url.append(filterName, `max:${max}`);
      }
    }
  }
  window.history.pushState(null, "", `?${url.toString()}`);
};

const getFilterType = (filterName: string) => {
  if (filterName === "vote_average") {
    return "range";
  }
  return "text";
};

export function MoviesTable({ movies }: { movies: MovieResponse[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  // console.log("columnFilters:", columnFilters);

  const table = useReactTable({
    data: movies,
    columns: columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const handleFilterChange = (
    filterName: string,
    value: RangeFilter | TextFilter
  ) => {
    if (typeof value === "string") {
      if (value) {
        table.getColumn(filterName)?.setFilterValue(value);
      }
    } else if ("min" in value && "max" in value) {
      table.getColumn(filterName)?.setFilterValue({
        min: value.min ?? 0,
        max: value.max ?? Number.POSITIVE_INFINITY,
      });
    }
    updateUrl(filterName, value);
  };

  React.useEffect(() => {
    // parse url
    // apply filters
    const currentSearch = window.location.search;
    const url = new URLSearchParams(currentSearch);
    console.log("start applying filters..........");
    for (const [name, value] of url.entries()) {
      const filterType = getFilterType(name);
      if (filterType === "range") {
        table
          .getColumn(name)
          ?.setFilterValue((prev: RangeFilter | undefined) => ({
            ...prev,
            [value.split(":")[0]]: parseFloat(value.split(":")[1]),
          }));
      } else if (filterType === "text") {
        table.getColumn(name)?.setFilterValue(value);
      }
    }
    console.log("finished applying filters..........");
  }, [table]);

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter(column => column.getCanHide())
              .map(column => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={value => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  return (
                    <TableHead key={header.id} className="p-4 pl-0 first:pl-4">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}{" "}
                      {header.column.getCanFilter() &&
                        getColumnFilter({
                          filterName: header.column.id,
                          filterType:
                            // @ts-expect-error need to figure out the declare module part
                            header.column.columnDef.meta?.filterType as string,
                          filterValue: header.column.getFilterValue(),
                          handleFilterChange,
                        })}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map(cell => (
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
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
