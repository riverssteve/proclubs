import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface GameAverageToggleProps {
  isPer90: boolean;
  setIsPer90: (value: boolean) => void;
  disabled?: boolean;
  label?: string;
  className?: string;
}

export const GameAverageToggle: React.FC<GameAverageToggleProps> = ({
  isPer90,
  setIsPer90,
  disabled = false,
  label = "Per 90 Minutes",
  className = "",
}) => {
  const id = `per90-toggle-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Switch
        id={id}
        checked={isPer90}
        onCheckedChange={setIsPer90}
        disabled={disabled}
      />
      <Label htmlFor={id} className={disabled ? "text-gray-400" : ""}>
        {label}
      </Label>
    </div>
  );
};
