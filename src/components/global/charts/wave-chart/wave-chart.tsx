import React from "react";
import classes from "./wave-chart.module.css";
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

// Extend the recharts tooltip props type
interface CustomTooltipProps extends TooltipProps<number, string> {
  active?: boolean;
  payload?: any[];
}

const WavyChart: React.FC<any> = ({ data: initialData }) => {
  // Custom tooltip to show the value of the highlighted data point
  const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
    if (active && payload && payload.length && payload[0].payload.highlight) {
      // Get the value from the highlighted data point
      const value = payload[0].payload.value;
      return (
        <div
          className="bg-white p-2 rounded shadow-md text-center"
          style={{ fontFamily: "'League Spartan', sans-serif" }}
        >
          <p className={classes.statsHover}>{value} Hours</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={classes.chartContainer}>
      {/* Adding League Spartan font from Google Fonts */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=League+Spartan:wght@400;500;600;700&display=swap');
        `}
      </style>

      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={initialData}
          //   margin={{ top: 30, right: 30, left: 20, bottom: 10 }}
        >
          <defs>
            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38B6FF" stopOpacity={0.5} />
              <stop offset="100%" stopColor="#FBFCFE" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.2} />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{
              fontSize: 12,
              fill: "#999",
              fontFamily: "'League Spartan', sans-serif",
            }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{
              fontSize: 12,
              fill: "#999",
              fontFamily: "'League Spartan', sans-serif",
            }}
            domain={[0, 40]}
            ticks={[5, 10, 20, 30, 40]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#38B6FF"
            strokeWidth={2}
            fill="url(#colorGradient)"
            activeDot={{
              r: 8,
              fill: "#38B6FF",
              stroke: "#ffffff",
              strokeWidth: 2,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WavyChart;
