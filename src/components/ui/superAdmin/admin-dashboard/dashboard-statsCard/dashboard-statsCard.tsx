import React from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import styles from "./dashboard-statsCard.module.css";

type StatsCardProps = {
  title: string;
  value: string | number;
  icon?: React.ElementType;
  trend?: {
    value: number;
    isPositive: boolean;
    label: string;
  };
  className?: string;
  description?: string;
  iconClassName?: string;
  valueClassName?: string;
  variant?: string;
  compact?: boolean;
  loading?: boolean; // New loading prop
};

const AdminDashboardStatsCard = ({
  title,
  value,
  icon: Icon,
  trend,
  className,
  description,
  iconClassName,
  valueClassName,
  variant = "default",
  compact = false,
  loading = false, // Default loading to false
}: StatsCardProps) => {
  // Combine CSS classes based on props
  const cardClasses = [
    styles.statsCard,
    styles[`variant${variant.charAt(0).toUpperCase() + variant.slice(1)}`],
    compact ? styles.compact : styles.default,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const textContainerClasses = [
    styles.textContainer,
    compact ? styles.textContainerCompact : styles.textContainerDefault,
  ].join(" ");

  const valueClasses = [
    styles.statsValue,
    compact ? styles.valueCompact : styles.valueDefault,
    valueClassName,
  ]
    .filter(Boolean)
    .join(" ");

  const iconContainerClasses = [
    styles.iconContainer,
    styles[`icon${variant.charAt(0).toUpperCase() + variant.slice(1)}`],
    iconClassName,
  ]
    .filter(Boolean)
    .join(" ");

  // If loading, show a skeleton loader
  if (loading) {
    return (
      <div className={`${cardClasses} ${styles.loading}`}>
        <div className={styles.content}>
          <div className={textContainerClasses}>
            <div className={styles.skeletonTitle}></div>
            <div className={styles.skeletonValue}></div>
            <div className={styles.skeletonTrend}></div>
          </div>
          <div className={styles.skeletonIcon}></div>
        </div>
      </div>
    );
  }

  return (
    <div className={cardClasses}>
      <div className={styles.content}>
        <div className={textContainerClasses}>
          <p className={styles.statsLabel}>{title}</p>
          <p className={valueClasses}>{value}</p>

          {trend && (
            <div
              className={`${styles.trend} ${
                trend.isPositive ? styles.trendPositive : styles.trendNegative
              }`}
            >
              {trend.isPositive ? (
                <ArrowUp
                  size={16}
                  color="#22c55e" // Tailwind's emerald-500, a visually attractive green
                  style={{ marginBottom: "6px" }}
                />
              ) : (
                <ArrowDown
                  size={16}
                  color="#ef4444" // Tailwind's red-500
                  style={{ marginBottom: "4px" }}
                />
              )}
              <span>
                {trend.value}% {trend.label}
              </span>
            </div>
          )}

          {description && <p className={styles.description}>{description}</p>}
        </div>

        {Icon && (
          <div className={iconContainerClasses}>
            <Icon size={20} />
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(AdminDashboardStatsCard);
