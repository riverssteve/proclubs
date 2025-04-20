import React from "react";
import { Button } from "@/components/ui/button";

export type MatchType = "leagueMatch" | "playoffMatch";

interface MatchTypeToggleProps {
  currentType: MatchType;
  onTypeChange: (type: MatchType) => void;
  className?: string;
}

export const MatchTypeToggle: React.FC<MatchTypeToggleProps> = ({
  currentType,
  onTypeChange,
  className = "",
}) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="font-medium text-sm">Match Type:</span>
      <div className="flex rounded-md overflow-hidden border border-gray-200 dark:border-gray-700">
        <Button
          variant={currentType === "leagueMatch" ? "default" : "ghost"}
          className={`rounded-none py-1 px-4 text-sm ${
            currentType === "leagueMatch"
              ? ""
              : "text-gray-600 dark:text-gray-300"
          }`}
          onClick={() => onTypeChange("leagueMatch")}
        >
          League
        </Button>
        <Button
          variant={currentType === "playoffMatch" ? "default" : "ghost"}
          className={`rounded-none py-1 px-4 text-sm ${
            currentType === "playoffMatch"
              ? ""
              : "text-gray-600 dark:text-gray-300"
          }`}
          onClick={() => onTypeChange("playoffMatch")}
        >
          Playoff
        </Button>
      </div>
    </div>
  );
};
