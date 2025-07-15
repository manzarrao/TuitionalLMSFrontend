import React, { useState, useRef, useEffect } from "react";
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
import styles from "./sessionHour-chart.module.css";
import ChartContainer from "../chartContainer/chartContainer";

interface HourData {
  hour: string;
  rate: number;
}

interface GradeMultipliers {
  [key: string]: number;
}

const SessionsHourChart: React.FC = () => {
  const [selectedGrade, setSelectedGrade] = useState("All Grades");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Base data for all grades
  const baseData: HourData[] = [
    { hour: "8:00", rate: 0.6 },
    { hour: "9:00", rate: 1.2 },
    { hour: "10:00", rate: 1.8 },
    { hour: "11:00", rate: 2.1 },
    { hour: "12:00", rate: 1.4 },
    { hour: "13:00", rate: 1.2 },
    { hour: "14:00", rate: 1.7 },
    { hour: "15:00", rate: 2.8 },
    { hour: "16:00", rate: 3.5 },
    { hour: "17:00", rate: 4.2 },
    { hour: "18:00", rate: 4.8 },
    { hour: "19:00", rate: 3.9 },
    { hour: "20:00", rate: 2.7 },
    { hour: "21:00", rate: 1.5 },
  ];

  // Grade specific multipliers to adjust the data
  const gradeMultipliers: GradeMultipliers = {
    "All Grades": 1.0,
    "Grade 6-8": 0.85,
    "Grade 9-10": 1.15,
    "Grade 11-12": 1.25,
    "College Prep": 1.35,
  };

  // Available grade options
  const gradeOptions = Object.keys(gradeMultipliers);

  // Apply grade-specific multiplier to base data
  const data = baseData.map((item) => ({
    ...item,
    rate: parseFloat((item.rate * gradeMultipliers[selectedGrade]).toFixed(2)),
  }));

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
      <div className={styles.tooltip}>
        <div className={styles.tooltipLabel}>{label}</div>
        <div className={styles.tooltipContent}>
          <span className={styles.tooltipText}>Average</span>
          <span className={styles.tooltipValue}>
            {payload[0].value} sessions/student
          </span>
        </div>
      </div>
    );
  };

  return (
    <ChartContainer
      title="Sessions per Hour"
      subtitle="Average sessions student by hour"
    >
      <div className={styles.chartContainer}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="4 4"
              vertical={false}
              stroke="#f1f5f9"
            />
            <XAxis
              dataKey="hour"
              axisLine={false}
              tickLine={false}
              tick={{
                fontFamily: "var(--leagueSpartan-medium-500)",
                fontSize: "clamp(0.625rem, 0.541rem + 0.382vw, 1rem)",
                fill: "var(--text-color)",
              }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{
                fontFamily: "var(--leagueSpartan-medium-500)",
                fontSize: "clamp(0.625rem, 0.541rem + 0.382vw, 1rem)",
                fill: "var(--text-color)",
              }}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="rate" fill="#048CDB" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      ;
    </ChartContainer>
  );
};

export default SessionsHourChart;
