import React, { useId } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  TooltipProps,
} from "recharts";
import classes from "./studentDistribution.module.css";
import ChartContainer from "../chartContainer/chartContainer";

// Define types for chart data
type CurriculumData = {
  name: string;
  value: number;
};

// Define props for custom tooltip
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    payload: CurriculumData;
    color: string;
  }>;
  label?: string;
}

// Define props for custom legend
interface CustomLegendProps {
  payload?: Array<{
    value: string;
    color: string;
    payload: {
      name: string;
      value: number;
      color: string;
    };
  }>;
}

export default function StudentDistributionChart() {
  const chartId = useId();

  // Chart data
  const data: CurriculumData[] = [
    { name: "IGCSE", value: 35 },
    { name: "Edexcel", value: 25 },
    { name: "CBSE", value: 20 },
    { name: "IB", value: 15 },
    { name: "Others", value: 5 },
  ];

  // Color configuration for different curricula
  const colorConfig = {
    IGCSE: { lightColor: "#004771", darkColor: "#004771" }, // Blue
    Edexcel: { lightColor: "#048CDB", darkColor: "#048CDB" }, // Green
    IB: { lightColor: "#47BCFF", darkColor: "#47BCFF" }, // Purple
    CBSE: { lightColor: "#B3E4FF", darkColor: "#B3E4FF" }, // Amber
    Others: { lightColor: "#6D7578", darkColor: "#CD7578" }, // Pink
  };

  // Calculate the total value for percentage calculation
  const totalValue: number = data.reduce((sum, item) => sum + item.value, 0);

  // Custom tooltip component
  const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
    if (!active || !payload?.length) return null;

    const item = payload[0];
    const percentage = ((item.value / totalValue) * 100).toFixed(0);

    return (
      <div className={classes.tooltip}>
        <div className={classes.tooltipLabel}>{item.name}</div>
        <div className={classes.tooltipContent}>
          <div className={classes.tooltipItem}>
            <div
              className={classes.tooltipIndicator}
              style={{ backgroundColor: item.color }}
            />
            <span className={classes.tooltipName}>Count</span>
            <span className={classes.tooltipValue}>
              {item.value} students ({percentage}%)
            </span>
          </div>
        </div>
      </div>
    );
  };

  // Custom legend component
  const CustomLegend = ({ payload }: CustomLegendProps) => {
    if (!payload?.length) return null;

    return (
      <div className={classes.legend}>
        {payload.map((entry, index) => (
          <div key={`legend-${index}`} className={classes.legendItem}>
            <div
              className={classes.legendIndicator}
              style={{ backgroundColor: entry.color }}
            />
            <span className={classes.legendLabel}>{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <ChartContainer title="Student Distribution" subtitle="By curriculum">
      <div className={classes.chartWrapper}>
        {/* Inject theme variables */}
        <style
          dangerouslySetInnerHTML={{
            __html: Object.entries(colorConfig)
              .map(
                ([key, colors]) => `
            #chart-${chartId} .${key}-cell {
              fill: ${colors.lightColor};
            }
            @media (prefers-color-scheme: dark) {
              #chart-${chartId} .${key}-cell {
                fill: ${colors.darkColor};
              }
            }
          `
              )
              .join("\n"),
          }}
        />

        <ResponsiveContainer width="100%" height="100%" id={`chart-${chartId}`}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={70}
              paddingAngle={2}
              dataKey="value"
              nameKey="name"
            >
              {data.map((entry) => (
                <Cell
                  key={`cell-${entry.name}`}
                  className={`${entry.name}-cell`}
                  // Default color as fallback
                  fill={
                    colorConfig[entry.name as keyof typeof colorConfig]
                      ?.lightColor || "#ccc"
                  }
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              content={<CustomLegend />}
              verticalAlign="bottom"
              height={36}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </ChartContainer>
  );
}
