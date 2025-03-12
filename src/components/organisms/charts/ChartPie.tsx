import React from 'react';
import { Label, Pie, PieChart } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface ChartPieDataPoint {
  category: string;
  percentage: number;
  fill?: string;
}

interface ChartPieProps {
  data: ChartPieDataPoint[];
  centerLabel?: string;
  centerSubLabel?: string;
  dataKey?: string;
  categoryKey?: string;
  innerRadius?: number;
  outerRadius?: number;
  chartConfig?: ChartConfig;
}

export const ChartPie: React.FC<ChartPieProps> = ({
  data,
  centerLabel,
  centerSubLabel,
  dataKey = 'percentage',
  categoryKey = 'category',
  innerRadius = 50,
  outerRadius = 80,
  chartConfig = {
    value: {
      label: "Value",
      color: "var(--chart-1)",
    }
  },
}) => {
  return (
    <ChartContainer config={chartConfig} className="flex-1 pb-0">
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie
          data={data}
          dataKey={dataKey}
          nameKey={categoryKey}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
        >
          {centerLabel && (
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className="fill-foreground text-3xl font-bold"
                      >
                        {centerLabel}
                      </tspan>
                      {centerSubLabel && (
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          {centerSubLabel}
                        </tspan>
                      )}
                    </text>
                  );
                }
                return null;
              }}
            />
          )}
        </Pie>
      </PieChart>
    </ChartContainer>
  );
};
