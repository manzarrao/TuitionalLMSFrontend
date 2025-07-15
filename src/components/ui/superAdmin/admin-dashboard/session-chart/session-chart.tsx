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
import classes from "./session-chart.module.css";
import ChartContainer from "../chartContainer/chartContainer";

// Define types for our data
type DataPoint = {
  name: string;
  sessions: number;
};

// Define chart configuration type
type ChartConfig = {
  [key: string]: {
    label: string;
    color: string;
  };
};

// Define tooltip props type
interface CustomTooltipProps extends TooltipProps<number, string> {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: DataPoint;
  }>;
  label?: string;
}

export default function SessionsChart(): JSX.Element {
  const chartId = useId();

  const data: DataPoint[] = [
    { name: "1", sessions: 30 },
    { name: "5", sessions: 42 },
    { name: "10", sessions: 38 },
    { name: "15", sessions: 50 },
    { name: "20", sessions: 65 },
    { name: "25", sessions: 78 },
    { name: "30", sessions: 85 },
    { name: "100", sessions: 50000 },
    { name: "200", sessions: 60000 },
    { name: "100", sessions: 50000 },
    { name: "100", sessions: 50000 },
    { name: "1000", sessions: 10000 },
    { name: "100", sessions: 50000 },
    { name: "200", sessions: 60000 },
    { name: "100", sessions: 50000 },
    { name: "100", sessions: 50000 },
    { name: "1", sessions: 30 },
    { name: "5", sessions: 42 },
    { name: "10", sessions: 38 },
    { name: "15", sessions: 50 },
    { name: "20", sessions: 65 },
    { name: "25", sessions: 78 },
    { name: "30", sessions: 85 },
    { name: "1000", sessions: 10000 },
  ];

  const chartConfig: ChartConfig = {
    sessions: {
      label: "Sessions",
      color: "#048CDB", // Blue color for sessions
    },
  };

  // Custom tooltip component
  const CustomTooltip: React.FC<CustomTooltipProps> = ({
    active,
    payload,
    label,
  }) => {
    if (!active || !payload?.length) return null;

    return (
      <div className={classes.tooltip}>
        <div className={classes.tooltipLabel}>{payload[0]?.payload.name}</div>
        <div className={classes.tooltipContent}>
          <div className={classes.tooltipItem}>
            <div className={classes.tooltipIndicator} />
            <span className={classes.tooltipName}>Sessions</span>
            <span className={classes.tooltipValue}>{payload[0]?.value}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <ChartContainer title="Sessions Booked" subtitle="Last 30 days">
      <div className={classes.chartWrapper}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient
                id={`sessionGradient-${chartId}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor={chartConfig.sessions.color}
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor={chartConfig.sessions.color}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f1f5f9"
              className={classes.grid}
            />
            <XAxis
              dataKey="name"
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
              axisLine={false}
              tickLine={false}
              tick={{
                fontFamily: "var(--leagueSpartan-medium-500)",
                fontSize: "clamp(0.625rem, 0.541rem + 0.382vw, 1rem)",
                fill: "var(--text-color)",
              }}
              className={classes.axis}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="sessions"
              stroke={chartConfig.sessions.color}
              strokeWidth={2}
              fillOpacity={1}
              fill={`url(#sessionGradient-${chartId})`}
              className={classes.area}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartContainer>
  );
}
