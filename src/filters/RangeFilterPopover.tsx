import {
  ComponentPropsWithoutRef,
  PropsWithChildren,
  useEffect,
  useRef,
  useState,
} from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { FilterType } from "./types";
import { usePopover } from "./usePopover";

export type RangeFilter = { min: string | undefined; max: string | undefined };

type Props = {
  filterName: string;
  filterType: FilterType;
  filterValue: RangeFilter;
  // TODO: filterType as enum
  onFilterChange: (
    filterType: FilterType,
    name: string,
    value: RangeFilter
  ) => void;
  filterProps?: ComponentPropsWithoutRef<"input">;
};

export function RangeFilterPopover({
  filterName,
  filterType,
  filterValue,
  onFilterChange,
  filterProps,
  children,
}: PropsWithChildren<Props>) {
  const [isOpen, setIsOpen] = useState(false);
  const [range, setRange] = useState<RangeFilter>({
    min: "",
    max: "",
  });
  const ref = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  usePopover({ popoverRef: ref, buttonRef, setIsOpen });

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRange(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onFilterChange(filterType, filterName, range);
    }
  };

  useEffect(() => {
    if (filterType === "range") {
      setRange(filterValue ? filterValue : { min: "", max: "" });
    }
  }, [filterType, filterValue]);

  return (
    <Popover onOpenChange={handleOpenChange} open={isOpen}>
      <PopoverTrigger
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        asChild
      >
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-120 dark" ref={ref}>
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">{filterName}</h4>
            <p className="text-muted-foreground">
              Set the range for the {filterName}.
            </p>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="width">Min.</Label>
              <Input
                id="width"
                className="col-span-2 h-8"
                name="min"
                type="number" // maybe text is more versatile, or just pass the prop right? 🤪
                value={range.min}
                onChange={handleInput}
                {...filterProps}
              />
            </div>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="width">Max.</Label>
              <Input
                id="width"
                className="col-span-2 h-8"
                name="max"
                type="number"
                value={range.max}
                onChange={handleInput}
                {...filterProps}
              />
            </div>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-2 items-center gap-4">
              <Button
                onClick={() => {
                  handleOpenChange(false);
                  setIsOpen(false);
                }}
                className="bg-blue-300"
              >
                Apply
              </Button>
              <Button
                onClick={() => {
                  setRange({ min: "", max: "" });
                  handleOpenChange(false);
                  setIsOpen(false);
                }}
                className="bg-red-300"
              >
                Clear
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
