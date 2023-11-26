import FilterIcon from "/filter.png";
import { Button } from "@/components/ui/button";
import { RangeFilter, RangeFilterPopover } from "@/filters/RangeFilterPopover";
import { TextFilter, TextFilterPopover } from "@/filters/TextFilterPopover";

// TODO: rename/refactor
type FilterFor = {
  filterName: string;
  filterType: string;
  filterValue: unknown;
  handleFilterChange: (
    filterName: string,
    value: RangeFilter | TextFilter
  ) => void;
};

export function getColumnFilter({
  filterName,
  filterType,
  filterValue,
  handleFilterChange,
}: FilterFor) {
  if (filterType === "range") {
    return (
      <RangeFilterPopover
        filterName={filterName}
        filterType={filterType}
        filterValue={filterValue as RangeFilter}
        onFilterChange={handleFilterChange}
      >
        <Button className="bg-transparent dark:bg-background">
          <img
            src={FilterIcon}
            className="h-4 w-4 filter invert"
            alt="Filter"
          />
        </Button>
      </RangeFilterPopover>
    );
  } else if (filterType === "text") {
    return (
      <TextFilterPopover
        filterName={filterName}
        filterType={filterType}
        filterValue={filterValue as string}
        onFilterChange={handleFilterChange}
      >
        <Button className="bg-transparent dark:bg-background">
          <img
            src={FilterIcon}
            className="h-4 w-4 filter invert"
            alt="Filter"
          />
        </Button>
      </TextFilterPopover>
    );
  }
}
