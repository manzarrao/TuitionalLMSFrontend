import React, { FC } from "react";
import classes from "./chartContainer.module.css";

interface ChartContainerProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

const ChartContainer: FC<ChartContainerProps> = ({
  title,
  subtitle,
  children,
}) => {
  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <h3 className={classes.title}>{title}</h3>
        <p className={classes.subtitle}>{subtitle}</p>
      </div>
      {children}
    </div>
  );
};

export default ChartContainer;
