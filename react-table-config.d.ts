import "@tanstack/react-table";

import { FilterType } from "@/filters/types";

declare module "@tanstack/table-core" {
  interface ColumnMeta<TData extends RowData, TValue> {
    filterType: FilterType;
    filter?: Filter<TData, TValue>;
  }
}
