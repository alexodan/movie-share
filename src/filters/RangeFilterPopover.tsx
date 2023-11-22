import { ComponentPropsWithoutRef, PropsWithChildren, useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type Props = {
  filterName: string;
  onFilterChange: (name: string, range: RangeFilter) => void;
  filterProps?: ComponentPropsWithoutRef<"input">;
};

export type RangeFilter = { min: string | undefined; max: string | undefined };

export function RangeFilterPopover({
  filterName,
  onFilterChange,
  filterProps,
  children,
}: PropsWithChildren<Props>) {
  const [range, setRange] = useState({
    min: "",
    max: "",
  });

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRange(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onFilterChange(filterName, range);
    }
  };

  return (
    <Popover onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-120 dark">
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
        </div>
      </PopoverContent>
    </Popover>
  );
}
