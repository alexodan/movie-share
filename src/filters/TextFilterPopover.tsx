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

type Props = {
  filterName: string;
  filterType: FilterType;
  filterValue: string;
  onFilterChange: (
    filterType: FilterType,
    name: string,
    value: TextFilter
  ) => void;
  filterProps?: ComponentPropsWithoutRef<"input">;
};

export type TextFilter = string;

export function TextFilterPopover({
  filterName,
  filterType,
  filterValue,
  onFilterChange,
  filterProps,
  children,
}: PropsWithChildren<Props>) {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState<string | null>(null);

  const ref = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  usePopover({ popoverRef: ref, buttonRef, setIsOpen });

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onFilterChange(filterType, filterName, value ?? "");
    }
  };

  useEffect(() => {
    if (filterType === "text") {
      setValue(filterValue);
    }
  }, [filterType, filterValue, filterName]);

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
              Set the value to search for the {filterName}.
            </p>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="width">Value</Label>
              <Input
                id="width"
                className="col-span-2 h-8"
                name="value"
                onChange={handleInput}
                value={value ?? ""}
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
                  setValue(null);
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
