import React from "react";
import { StatCard } from "@/components/molecules/StatCard";

interface PositionCount {
  midfielder: number;
  goalkeeper: number;
  forward: number;
  defender: number;
}

interface PositionDistributionProps {
  positionCount: PositionCount;
  className?: string;
}

export const PositionDistribution: React.FC<PositionDistributionProps> = ({
  positionCount,
  className = "",
}) => {
  const positionColors: Record<string, string> = {
    forward: "#1e40af",
    midfielder: "#2563eb",
    defender: "#60a5fa",
    goalkeeper: "#bfdbfe",
  };

  return (
    <StatCard
      title="Position Distribution"
      description="Player positions in team"
      className={className}
    >
      <div className="space-y-2 p-6">
        {Object.entries(positionCount).map(([position, count]) => (
          <div key={position} className="flex items-center">
            <div
              className="w-4 h-4 rounded-full mr-2"
              style={{ backgroundColor: positionColors[position] }}
            ></div>
            <span className="capitalize">{position}:</span>
            <span className="ml-auto font-bold">{count}</span>
          </div>
        ))}
      </div>
    </StatCard>
  );
};
