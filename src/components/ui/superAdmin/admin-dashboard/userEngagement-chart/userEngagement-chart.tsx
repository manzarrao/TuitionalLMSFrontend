import React, { useId } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";
import classes from "./userEngagement-chart.module.css";
import ChartContainer from "../chartContainer/chartContainer";

// Define data types
type DataPoint = {
  day: string;
  activeUsers: number;
  avgTimeSpent: number;
};

// Define custom tooltip props
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    dataKey: string;
    color: string;
    name: string;
    payload: DataPoint;
  }>;
  label?: string;
}

interface UserEngagementChartProps {
  className?: string;
}

export default function UserEngagementChart({
  className,
}: UserEngagementChartProps): JSX.Element {
  const chartId = useId();

  // Chart data
  const data: DataPoint[] = [
    { day: "Mon", activeUsers: 760, avgTimeSpent: 38 },
    { day: "Tue", activeUsers: 820, avgTimeSpent: 41 },
    { day: "Wed", activeUsers: 930, avgTimeSpent: 47 },
    { day: "Thu", activeUsers: 950, avgTimeSpent: 44 },
    { day: "Fri", activeUsers: 880, avgTimeSpent: 42 },
    { day: "Sat", activeUsers: 680, avgTimeSpent: 36 },
    { day: "Sun", activeUsers: 590, avgTimeSpent: 32 },
  ];

  const chartConfig = {
    activeUsers: {
      label: "Active Users",
      lightColor: "#048CDB", // Purple for light mode
    },
    avgTimeSpent: {
      label: "Avg. Time (min)",
      lightColor: "#EC4899", // Pink for light mode
    },
  };

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (!active || !payload?.length) return null;

    return (
      <div className={classes.tooltip}>
        <div className={classes.tooltipLabel}>{label}</div>
        <div className={classes.tooltipContent}>
          {payload.map((entry, index) => {
            const isActiveUsers = entry.dataKey === "activeUsers";
            const tooltipLabel = isActiveUsers
              ? "Active Users"
              : "Avg. Time (min)";

            return (
              <div key={`item-${index}`} className={classes.tooltipItem}>
                <div
                  className={classes.tooltipIndicator}
                  style={{ backgroundColor: entry.color }}
                />
                <span className={classes.tooltipName}>{tooltipLabel}</span>
                <span className={classes.tooltipValue}>
                  {entry.value.toLocaleString()}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <ChartContainer
      title="User Engagement"
      subtitle="Active users & average time spent"
    >
      <div className={classes.chartWrapper}>
        {/* Inject theme variables */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
            #chart-${chartId} {
              --color-activeUsers: ${chartConfig.activeUsers.lightColor};
              --color-avgTimeSpent: ${chartConfig.avgTimeSpent.lightColor};
            }
         
            
          `,
          }}
        />

        <ResponsiveContainer width="100%" height="100%" id={`chart-${chartId}`}>
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
          >
            <defs>
              <linearGradient
                id={`activeUsersGradient-${chartId}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor="#004771" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#004771" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f1f5f9"
              className={classes.grid}
            />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{
                fontFamily: "var(--leagueSpartan-medium-500)",
                fontSize: "clamp(0.625rem, 0.541rem + 0.382vw, 1rem)",
                fill: "var(--text-color)",
              }}
              className={classes.axis}
            />
            <YAxis
              yAxisId="left"
              axisLine={false}
              tickLine={false}
              tick={{
                fontFamily: "var(--leagueSpartan-medium-500)",
                fontSize: "clamp(0.625rem, 0.541rem + 0.382vw, 1rem)",
                fill: "var(--text-color)",
              }}
              width={30}
              className={classes.axis}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              axisLine={false}
              tickLine={false}
              tick={{
                fontFamily: "var(--leagueSpartan-medium-500)",
                fontSize: "clamp(0.625rem, 0.541rem + 0.382vw, 1rem)",
                fill: "var(--text-color)",
              }}
              domain={[0, 60]}
              width={30}
              className={classes.axis}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="activeUsers"
              stroke="#004771"
              strokeWidth={2}
              fillOpacity={1}
              fill={`url(#activeUsersGradient-${chartId})`}
              className={classes.area}
            />
            <Area
              yAxisId="right"
              type="monotone"
              stroke="#048CDB"
              dataKey="avgTimeSpent"
              strokeWidth={2}
              fillOpacity={0}
              className={classes.area}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartContainer>
  );
}
