import React, { useId } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  TooltipProps,
} from "recharts";
import classes from "./attendance-chart.module.css";
import ChartContainer from "../chartContainer/chartContainer";

// Define data type
type SubjectData = {
  name: string;
  attendance: number;
};

// Define tooltip props type
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    dataKey: string;
    name: string;
    color: string;
    payload: SubjectData;
  }>;
  label?: string;
}

type IProps = {
  lable?: string;
};

const AttendanceChart: React.FunctionComponent<IProps> = ({ lable }) => {
  const chartId = useId();

  // Chart data
  const data: SubjectData[] = [
    { name: "Math", attendance: 92 },
    { name: "Physics", attendance: 86 },
    { name: "Chemistry", attendance: 89 },
    { name: "Biology", attendance: 78 },
    { name: "English", attendance: 84 },
    { name: "History", attendance: 75 },
  ];

  const chartConfig = {
    attendance: {
      label: lable,
      lightColor: "#3B82F6", // Blue color for light mode
    },
  };

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (!active || !payload?.length) return null;

    return (
      <div className={classes.tooltip}>
        <div className={classes.tooltipLabel}>{label}</div>
        <div className={classes.tooltipContent}>
          {payload.map((entry, index) => (
            <div key={`item-${index}`} className={classes.tooltipItem}>
              <div
                className={classes.tooltipIndicator}
                style={{ backgroundColor: entry.color }}
              />
              <span className={classes.tooltipName}>Attendance</span>
              <span className={classes.tooltipValue}>{entry.value}%</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <ChartContainer
      title={lable || "Attendance Rate"}
      subtitle="By subject (last 30 days)"
    >
      <div className={classes.chartWrapper}>
        {/* Inject theme variables */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
            #chart-${chartId} {
              --color-attendance: ${chartConfig.attendance.lightColor};
            }  
          `,
          }}
        />

        <ResponsiveContainer width="100%" height="100%" id={`chart-${chartId}`}>
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
          >
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
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
              className={classes.axis}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="attendance"
              fill="var(--main-color)"
              radius={[4, 4, 0, 0]}
              className={classes.bar}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartContainer>
  );
};

export default AttendanceChart;
