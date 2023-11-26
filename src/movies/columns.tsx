import { rankItem } from "@tanstack/match-sorter-utils";
import { createColumnHelper, FilterFn, Row } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { MovieResponse } from "./model";

const columnHelper = createColumnHelper<MovieResponse>();

type Range = {
  min: string;
  max: string;
};

export const rangeFilter: FilterFn<MovieResponse> = (
  row: Row<MovieResponse>,
  columnId: string,
  value: Range
) => {
  const item = row.getValue<number>(columnId);
  if (
    Number.isFinite(parseFloat(value.min)) &&
    Number.isFinite(parseFloat(value.max))
  ) {
    return item >= parseFloat(value.min) && item <= parseFloat(value.max);
  } else if (Number.isFinite(parseFloat(value.min))) {
    return item >= parseFloat(value.min);
  } else if (Number.isFinite(parseFloat(value.max))) {
    return item <= parseFloat(value.max);
  }
  return true;
};

export const textFilter: FilterFn<MovieResponse> = (
  row: Row<MovieResponse>,
  columnId: string,
  value: string,
  addMeta
) => {
  const itemRank = rankItem(row.getValue(columnId), value);
  // Store the ranking info
  addMeta(itemRank);
  // Return if the item should be filtered in/out
  return itemRank.passed;
};

export const columns = [
  columnHelper.display({
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={value => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  }),
  columnHelper.accessor("id", {
    header: () => <span className="px-4">ID</span>,
    cell: info => <div>{info.getValue()}</div>,
  }),
  columnHelper.accessor("title", {
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("title")}</div>
    ),
    filterFn: textFilter,
    meta: {
      filterType: "text",
    },
  }),
  columnHelper.accessor("popularity", {
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Popularity
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const popularity = parseFloat(row.getValue("popularity"));
      return <div className="font-medium">{popularity}</div>;
    },
    filterFn: rangeFilter,
    meta: {
      filterType: "range",
    },
  }),
  columnHelper.accessor("vote_average", {
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Vote average
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const vote_average = parseFloat(row.getValue("vote_average"));
      return <div className="font-medium">{vote_average}</div>;
    },
    filterFn: rangeFilter,
    meta: {
      filterType: "range",
    },
  }),
  columnHelper.accessor("release_date", {
    header: () => <Button variant="ghost">Release date</Button>,
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("release_date")}</div>;
    },
  }),
  columnHelper.display({
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const movie = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(movie.id.toString())}
            >
              Copy movie ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View movie details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    enableColumnFilter: false,
  }),
];
