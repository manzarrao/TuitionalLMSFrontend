"use client";
import classes from "./bar-chart.module.css";
import { useEffect, useRef, CSSProperties } from "react";

interface DataItem {
  month: string;
  total_paid: number;
}

interface BarChartProps {
  data: DataItem[];
  inlineStyles?: CSSProperties;
  heading?: string;
}

export default function BarCharts({
  data,
  inlineStyles,
  heading,
}: BarChartProps): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Define font family with weight
    const fontFamily = '"League Spartan", sans-serif';
    const fontWeight = 500;

    // Find the maximum value for scaling
    const values = data.map((item) => item.total_paid);
    const maxValue = Math.max(...values, 100); // Ensure minimum scale even if all values are 0

    // Set y-axis step size based on max value
    let yAxisStepSize: number;
    if (maxValue <= 5000) {
      yAxisStepSize = 1000; // For smaller values, use 1000 steps
    } else {
      yAxisStepSize = 1500; // For larger values, use 1500 steps
    }

    // Round up to the nearest yAxisStepSize
    const yAxisMax = Math.ceil(maxValue / yAxisStepSize) * yAxisStepSize;

    // Chart area dimensions with padding for axes
    const padding = { top: 20, right: 20, bottom: 50, left: 60 };
    const chartWidth = rect.width - padding.left - padding.right;
    const chartHeight = rect.height - padding.top - padding.bottom;

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height);

    // Calculate number of steps based on yAxisMax and step size
    const yAxisSteps = yAxisMax / yAxisStepSize;
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    ctx.font = `${fontWeight} 12px ${fontFamily}`; // 500 weight
    ctx.fillStyle = "#6d757e";

    for (let i = 0; i <= yAxisSteps; i++) {
      const y = padding.top + (chartHeight / yAxisSteps) * (yAxisSteps - i);
      const value = yAxisStepSize * i;

      // Y-axis label (horizontal grid lines removed)
      ctx.fillText(value.toLocaleString(), padding.left - 10, y);
    }

    // Calculate bar width based on available space
    const barWidth = chartWidth / data.length;
    const barSpacing = barWidth * 0.2;
    const adjustedBarWidth = barWidth - barSpacing;
    const borderRadius = 10; // Border radius for bars

    // Draw bars and x-axis labels
    ctx.textAlign = "center";
    ctx.textBaseline = "top";

    data.forEach((item, index) => {
      const x = padding.left + index * barWidth + barSpacing / 2;
      const value = item.total_paid;
      const barHeight = value > 0 ? (value / yAxisMax) * chartHeight : 0;
      const y = rect.height - padding.bottom - barHeight;

      // Draw bar background with rounded corners on all sides
      ctx.fillStyle = "#ecf8ff";

      // Draw rounded rectangle for background (all corners rounded)
      drawRoundedRect(
        ctx,
        x,
        padding.top,
        adjustedBarWidth,
        chartHeight,
        borderRadius,
        "#ecf8ff",
        "transparent", // No border for background
        true // Force all corners to be rounded
      );

      // Draw bar with gradient and border radius
      if (value > 0) {
        // Create vertical gradient with blur effect at the transition
        const gradient = ctx.createLinearGradient(
          x,
          y, // top of bar
          x,
          y + barHeight // bottom of bar
        );

        // Add multiple color stops to create blur effect at the 50% point
        gradient.addColorStop(0, "#38B6FF"); // Solid blue at top
        gradient.addColorStop(0.45, "#38B6FF"); // Blue starts to fade
        gradient.addColorStop(0.48, "#60C3FF"); // Lighter blue for blur effect
        gradient.addColorStop(0.5, "#8AD1FF"); // Even lighter blue at middle
        gradient.addColorStop(0.52, "#D0EAFF"); // Light blue/white mix
        gradient.addColorStop(0.55, "#FFFFFF"); // White starts to solidify
        gradient.addColorStop(1, "#FFFFFF"); // Solid white at bottom

        // Draw rounded rectangle with border (all corners rounded)
        drawRoundedRect(
          ctx,
          x,
          y,
          adjustedBarWidth,
          barHeight,
          borderRadius,
          gradient,
          "#033A5A",
          true // Force all corners to be rounded
        );
      }

      // Draw x-axis label (month)
      ctx.fillStyle = "#6d757e";
      ctx.font = `${fontWeight} 12px ${fontFamily}`; // 500 weight
      ctx.fillText(
        item.month.slice(0, 3),
        x + adjustedBarWidth / 2,
        rect.height - padding.bottom + 10
      );

      // Draw value on top of the bar if it's not zero
      if (value > 0) {
        ctx.fillStyle = "#033A5A"; // Changed color for better contrast with gradient
        ctx.font = `${fontWeight} 10px ${fontFamily}`; // 500 weight
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";
        ctx.fillText(value.toLocaleString(), x + adjustedBarWidth / 2, y - 5);
      }
    });

    // Draw axis titles
    ctx.font = `${fontWeight} 14px ${fontFamily}`; // 500 weight
    ctx.fillStyle = "#1b2128";

    // Helper function to draw rounded rectangle with border
    function drawRoundedRect(
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      width: number,
      height: number,
      radius: number,
      fillStyle: string | CanvasGradient,
      strokeStyle: string,
      forceAllCorners: boolean = false
    ) {
      // Determine if we should round all corners
      const roundAllCorners = forceAllCorners || y !== padding.top;

      // Adjust radius if height is too small
      if (height < radius * 2) {
        radius = height / 2;
      }

      ctx.beginPath();

      // Top-left corner
      ctx.moveTo(x + radius, y);
      // Top edge and top-right corner
      ctx.lineTo(x + width - radius, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius);

      if (roundAllCorners) {
        // Right edge
        ctx.lineTo(x + width, y + height - radius);
        // Bottom-right corner
        ctx.quadraticCurveTo(
          x + width,
          y + height,
          x + width - radius,
          y + height
        );
        // Bottom edge
        ctx.lineTo(x + radius, y + height);
        // Bottom-left corner
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
      } else {
        // For background without rounded bottom corners
        ctx.lineTo(x + width, y + height);
        // Bottom edge (straight)
        ctx.lineTo(x, y + height);
      }

      // Left edge
      ctx.lineTo(x, y + radius);
      // Top-left corner
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();

      // Fill with color or gradient
      ctx.fillStyle = fillStyle;
      ctx.fill();

      // Stroke with border color (if not transparent)
      if (strokeStyle !== "transparent") {
        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  }, [data]);

  return (
    <div className={classes.container} style={inlineStyles}>
      {heading && <p className={classes.heading}>{heading}</p>}
      {data?.length > 0 && (
        <canvas ref={canvasRef} style={{ height: "20vh", width: "100%" }} />
      )}
    </div>
  );
}
