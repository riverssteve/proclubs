import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface StatOption {
  value: string;
  label: string;
  isPer90Compatible: boolean;
}

interface StatSelectProps {
  selectedStat: string;
  onStatChange: (value: string) => void;
  options: StatOption[];
  className?: string;
}

export const StatSelect: React.FC<StatSelectProps> = ({
  selectedStat,
  onStatChange,
  options,
  className = "",
}) => {
  return (
    <div className={className}>
      <label className="block mb-2 font-medium">Select Stat to Compare:</label>
      <Select value={selectedStat} onValueChange={onStatChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a stat to compare" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Statistics</SelectLabel>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};
