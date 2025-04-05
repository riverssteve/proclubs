import React, { useMemo } from "react";
import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts";
import { ChartContainer } from "@/components/ui/chart";

interface DataPoint {
  name: string;
  value: number;
  position?: string;
}

interface ChartConfig {
  [key: string]: {
    label: string;
    color: string;
    formatter?: (value: number) => string;
  };
}

interface ChartBarProps {
  data: DataPoint[];
  dataKey?: string;
  layout?: "horizontal" | "vertical";
  showLabels?: boolean;
  hideAxis?: boolean;
  height?: number;
  margin?: { top?: number; right?: number; bottom?: number; left?: number };
  chartConfig?: ChartConfig;
}

const getTickSize = (maxValue: number, numberOfTicks: number): number => {
  const rawTickSize = maxValue / numberOfTicks;
  const magnitude = Math.pow(10, Math.floor(Math.log10(rawTickSize)));

  const normalizedTickSize = rawTickSize / magnitude;

  // Choose a nice rounded number as multiplier
  let niceFactor;
  if (normalizedTickSize < 1.5) niceFactor = 1;
  else if (normalizedTickSize < 3) niceFactor = 2;
  else if (normalizedTickSize < 7) niceFactor = 5;
  else niceFactor = 10;

  return niceFactor * magnitude;
};

export const ChartBar: React.FC<ChartBarProps> = ({
  data,
  dataKey = "value",
  layout = "vertical",
  showLabels = true,
  hideAxis = false,
  height = 300,
  margin = { left: 60, right: 35 },
  chartConfig = {
    value: {
      label: "Value",
      color: "var(--chart-1)",
    },
  },
}) => {
  const customTicks = useMemo(() => {
    if (!data.length) return [];

    // Find max value
    const maxValue = Math.max(...data.map((d) => d.value));

    // Start with minimum ticks and try until we find a suitable number
    let desiredNumberOfTicks = 4;
    const maxTicks = 7; // Set an upper limit to prevent too many ticks

    let tickSize = 1;
    let maxWithTicks;

    // Iterate until we find a suitable number of ticks
    while (desiredNumberOfTicks <= maxTicks) {
      tickSize = getTickSize(maxValue, desiredNumberOfTicks);
      maxWithTicks = tickSize * desiredNumberOfTicks;

      // If this number of ticks is sufficient, break the loop
      if (maxValue <= maxWithTicks) {
        break;
      }

      // Otherwise, try with one more tick
      desiredNumberOfTicks++;
    }

    // Generate ticks
    const ticks = [];
    for (let i = 0; i <= desiredNumberOfTicks; i++) {
      ticks.push(Math.round(i * tickSize * 100) / 100); // Round to 2 decimal places
    }

    console.log(
      `Using ${desiredNumberOfTicks} ticks for max value ${maxValue}`,
    );
    console.log("ticks", ticks);
    return ticks;
  }, [data]);

  return (
    <ChartContainer config={chartConfig}>
      <BarChart
        accessibilityLayer
        data={data}
        layout={layout}
        height={height}
        margin={margin}
      >
        <XAxis
          type={layout === "vertical" ? "number" : "category"}
          dataKey={layout === "vertical" ? dataKey : "name"}
          domain={layout === "vertical" ? [0, "dataMax"] : undefined}
          tickCount={5}
          ticks={customTicks}
          interval={0}
          hide={hideAxis}
        />
        <YAxis
          dataKey={layout === "vertical" ? "name" : dataKey}
          type={layout === "vertical" ? "category" : "number"}
          tickLine={layout === "vertical"}
          tickMargin={10}
          axisLine={!hideAxis}
          interval={0}
          includeHidden
          domain={layout === "horizontal" ? [0, "dataMax"] : undefined}
        />
        <Bar dataKey={dataKey} fill="var(--chart-1)" radius={4}>
          {showLabels && (
            <LabelList
              dataKey={dataKey}
              position={layout === "vertical" ? "right" : "top"}
              offset={8}
              className="fill-foreground"
              fontSize={12}
              formatter={(value: number) => {
                if (value <= 0) return "";
                return chartConfig.value.formatter
                  ? chartConfig.value.formatter(value)
                  : value.toFixed(1);
              }}
            />
          )}
        </Bar>
      </BarChart>
    </ChartContainer>
  );
};
