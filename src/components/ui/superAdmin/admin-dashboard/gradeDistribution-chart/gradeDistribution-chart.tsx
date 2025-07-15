import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";
import classes from "./gradeDistribution-chart.module.css";
import ChartContainer from "../chartContainer/chartContainer";

interface GradeData {
  grade: string;
  count: number;
}

const GradeDistributionChart: React.FC = () => {
  const data: GradeData[] = [
    { grade: "Grade 6", count: 158 },
    { grade: "Grade 7", count: 187 },
    { grade: "Grade 8", count: 210 },
    { grade: "Grade 9", count: 245 },
    { grade: "Grade 10", count: 275 },
    { grade: "Grade 11", count: 195 },
    { grade: "Grade 12", count: 175 },
  ];

  // Custom tooltip component
  const CustomTooltip: React.FC<TooltipProps<number, string>> = ({
    active,
    payload,
    label,
  }) => {
    if (!active || !payload || !payload.length) {
      return null;
    }

    return (
      <div className={classes.tooltip}>
        <div className={classes.tooltipLabel}>{label}</div>
        <div className={classes.tooltipContent}>
          <span className={classes.tooltipLabel}>Student Count</span>
          <span className={classes.tooltipValue}>
            {payload[0].value} students
          </span>
        </div>
      </div>
    );
  };

  return (
    <ChartContainer title="Grade Distribution" subtitle="By grade level">
      <div className={classes.chartContainer}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f1f5f9"
            />
            <XAxis
              dataKey="grade"
              axisLine={false}
              tickLine={false}
              tick={{
                fontFamily: "var(--leagueSpartan-medium-500)",
                fontSize: "clamp(0.625rem, 0.541rem + 0.382vw, 1rem)",
                fill: "var(--text-color)",
              }}
              interval={0}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{
                fontFamily: "var(--leagueSpartan-medium-500)",
                fontSize: "clamp(0.625rem, 0.541rem + 0.382vw, 1rem)",
                fill: "var(--text-color)",
              }}
              width={30}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="count"
              fill="#048CDB"
              radius={[4, 4, 0, 0]}
              // maxBarSize={50}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartContainer>
  );
};

export default GradeDistributionChart;
