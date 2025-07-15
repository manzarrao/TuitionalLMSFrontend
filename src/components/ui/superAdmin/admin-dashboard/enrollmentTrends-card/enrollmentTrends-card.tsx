import React, { useId } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  TooltipProps,
} from "recharts";
import styles from "./enrollmentTrends-card.module.css";
import ChartContainer from "../chartContainer/chartContainer";

// Define our data structure
type DataPoint = {
  month: string;
  newStudents: number;
  churn: number;
};

// Define tooltip props type
interface CustomTooltipProps extends TooltipProps<number, string> {
  active?: boolean;
  payload?: Array<{
    value: number;
    dataKey: string;
    name: string;
    color: string;
    payload: DataPoint;
  }>;
  label?: string;
}

export default function EnrollmentTrendsChart(): JSX.Element {
  const chartId = useId();

  const data: DataPoint[] = [
    { month: "Jan", newStudents: 45, churn: 12 },
    { month: "Feb", newStudents: 52, churn: 15 },
    { month: "Mar", newStudents: 78, churn: 18 },
    { month: "Apr", newStudents: 110, churn: 22 },
    { month: "May", newStudents: 125, churn: 16 },
    { month: "Jun", newStudents: 156, churn: 14 },
  ];

  const chartConfig = {
    newStudents: {
      label: "New Enrollments",
      color: "#048CDB", // Green color for new students
    },
    churn: {
      label: "Student Churn",
      color: "#F97316", // Orange color for churn
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
      <div className={styles.tooltip}>
        <div className={styles.tooltipLabel}>{label}</div>
        <div className={styles.tooltipContent}>
          {payload.map((entry, index) => (
            <div key={`item-${index}`} className={styles.tooltipItem}>
              <div
                className={styles.tooltipIndicator}
                style={{ backgroundColor: entry.color }}
              />
              <span className={styles.tooltipName}>
                {entry.dataKey === "newStudents"
                  ? "New Enrollments"
                  : "Student Churn"}
              </span>
              <span className={styles.tooltipValue}>{entry.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <ChartContainer title="Enrollment Trends" subtitle="New students vs churn">
      <div className={styles.chartWrapper}>
        <style
          dangerouslySetInnerHTML={{
            __html: `
            #chart-${chartId} {
              --color-newStudents: ${chartConfig.newStudents.color};
              --color-churn: ${chartConfig.churn.color};
            }
            @media (prefers-color-scheme: dark) {
              #chart-${chartId} {
                --color-newStudents: #34D399;
                --color-churn: #FB923C;
              }
            }
          `,
          }}
        />

        <ResponsiveContainer width="100%" height="100%" id={`chart-${chartId}`}>
          <LineChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f1f5f9"
              className={styles.grid}
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{
                fontFamily: "var(--leagueSpartan-medium-500)",
                fontSize: "clamp(0.625rem, 0.541rem + 0.382vw, 1rem)",
                fill: "var(--text-color)",
              }}
              className={styles.axis}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{
                fontFamily: "var(--leagueSpartan-medium-500)",
                fontSize: "clamp(0.625rem, 0.541rem + 0.382vw, 1rem)",
                fill: "var(--text-color)",
              }}
              className={styles.axis}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="newStudents"
              stroke="#048CDB"
              strokeWidth={2}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="churn"
              stroke="#004771"
              strokeWidth={2}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ChartContainer>
  );
}
