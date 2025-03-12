import React from 'react';
import { Bar, BarChart, LabelList, XAxis, YAxis } from 'recharts';
import { ChartConfig, ChartContainer } from "@/components/ui/chart";

interface DataPoint {
  name: string;
  value: number;
  position?: string;
}

interface ChartBarProps {
  data: DataPoint[];
  dataKey?: string;
  layout?: 'horizontal' | 'vertical';
  showLabels?: boolean;
  hideAxis?: boolean;
  height?: number;
  margin?: { top?: number; right?: number; bottom?: number; left?: number };
  chartConfig?: ChartConfig;
}

export const ChartBar: React.FC<ChartBarProps> = ({
  data,
  dataKey = 'value',
  layout = 'vertical',
  showLabels = true,
  hideAxis = false,
  height = 300,
  margin = { left: 60, right: 30 },
  chartConfig = {
    value: {
      label: "Value",
      color: "var(--chart-1)",
    }
  },
}) => {
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
          type={layout === 'vertical' ? 'number' : 'category'}
          dataKey={layout === 'vertical' ? dataKey : 'name'}
          domain={layout === 'vertical' ? [0, 'dataMax'] : undefined}
          tickCount={5}
          interval={0}
          hide={hideAxis}
        />
        <YAxis
          dataKey={layout === 'vertical' ? 'name' : dataKey}
          type={layout === 'vertical' ? 'category' : 'number'}
          tickLine={layout === 'vertical'}
          tickMargin={10}
          axisLine={!hideAxis}
          interval={0}
          includeHidden
          domain={layout === 'horizontal' ? [0, 'dataMax'] : undefined}
        />
        <Bar
          dataKey={dataKey}
          fill="var(--chart-1)"
          radius={4}
        >
          {showLabels && (
            <LabelList
              dataKey={dataKey}
              position={layout === 'vertical' ? 'right' : 'top'}
              offset={8}
              className="fill-foreground"
              fontSize={12}
              formatter={(value: number) => {
                if (value <= 0) return '';
                // Check if value has decimal part
                return value % 1 !== 0 ? value.toFixed(1) : value;
              }}
            />
          )}
        </Bar>
      </BarChart>
    </ChartContainer>
  );
};
