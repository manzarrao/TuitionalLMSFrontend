import React from "react";
import { Map } from "lucide-react";
import styles from "./geographicDistribution.module.css";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";
import { scaleLinear } from "d3-scale";
import ChartContainer from "../chartContainer/chartContainer";

interface CountryData {
  country: string;
  count: number;
  percentage: string;
  coordinates?: [number, number]; // Longitude, Latitude
}

// Add coordinates for each country
const geoData: CountryData[] = [
  {
    country: "United States",
    count: 845,
    percentage: "34%",
    coordinates: [-95.7129, 37.0902],
  },
  {
    country: "India",
    count: 420,
    percentage: "17%",
    coordinates: [78.9629, 20.5937],
  },
  {
    country: "United Kingdom",
    count: 215,
    percentage: "9%",
    coordinates: [-3.4359, 55.3781],
  },
  {
    country: "Canada",
    count: 175,
    percentage: "7%",
    coordinates: [-106.3468, 56.1304],
  },
  {
    country: "Australia",
    count: 140,
    percentage: "6%",
    coordinates: [133.7751, -25.2744],
  },
  {
    country: "Germany",
    count: 95,
    percentage: "4%",
    coordinates: [10.4515, 51.1657],
  },
  {
    country: "Singapore",
    count: 85,
    percentage: "3%",
    coordinates: [103.8198, 1.3521],
  },
  // "Other Countries" is not mapped since it's an aggregate
];

// Color scale for the map
const colorScale = scaleLinear<string>()
  .domain([0, 845]) // Min and max student counts
  .range(["#e6f7ff", "#0077cc"]); // Light blue to darker blue

const GeographicDistribution: React.FC = () => {
  // Original data array
  const countryData: CountryData[] = [
    { country: "United States", count: 845, percentage: "34%" },
    { country: "India", count: 420, percentage: "17%" },
    { country: "United Kingdom", count: 215, percentage: "9%" },
    { country: "Canada", count: 175, percentage: "7%" },
    { country: "Australia", count: 140, percentage: "6%" },
    { country: "Germany", count: 95, percentage: "4%" },
    { country: "Singapore", count: 85, percentage: "3%" },
    { country: "Other Countries", count: 525, percentage: "20%" },
  ];

  // Create a mapping of country names to counts for the map coloring
  const countryToCount = countryData.reduce((acc, { country, count }) => {
    acc[country] = count;
    return acc;
  }, {} as Record<string, number>);

  return (
    <ChartContainer
      title="Consumer Distribution"
      subtitle="students by country"
    >
      <div className={styles.contentWrapper}>
        <div className={styles.mapContainer}>
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{
              scale: 50,
              center: [0, -84],
            }}
          >
            <ZoomableGroup>
              <Geographies geography="/world-110m.json">
                {({ geographies }: any) =>
                  geographies.map((geo: any) => {
                    const countryName = geo.properties.NAME;
                    // Color intensity based on student count
                    const fillColor = countryToCount[countryName]
                      ? colorScale(countryToCount[countryName])
                      : "#004771"; // Default color for countries without data

                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={fillColor}
                        stroke="#D6D6DA"
                        style={{
                          default: {
                            outline: "none",
                          },
                          hover: {
                            outline: "none",
                            fill: "#93c5fd",
                          },
                          pressed: {
                            outline: "none",
                            fill: "#3b82f6",
                          },
                        }}
                      />
                    );
                  })
                }
              </Geographies>

              {/* Add markers for each country with data */}
              {geoData.map(({ country, count, coordinates }) => {
                if (!coordinates) return null;

                // Calculate marker size based on count
                const markerSize = Math.max(4, Math.min(12, count / 100));

                return (
                  <Marker key={country} coordinates={coordinates}>
                    <circle
                      r={markerSize}
                      fill="#FF5533"
                      stroke="#FFFFFF"
                      strokeWidth={0.5}
                    />
                    <title>{`${country}: ${count} students`}</title>
                  </Marker>
                );
              })}
            </ZoomableGroup>
          </ComposableMap>
        </div>

        <div className={styles.countryListContainer}>
          <div className={styles.countryList}>
            {countryData.map((item) => (
              <div key={item.country} className={styles.countryItem}>
                <div className={styles.countryNameWrapper}>
                  <div className={styles.countryDot}></div>
                  <span className={styles.countryName}>{item.country}</span>
                </div>
                <div className={styles.countryMetrics}>
                  <span className={styles.countryCount}>{item.count}</span>
                  <div className={styles.progressBarBg}>
                    <div
                      className={styles.progressBarFill}
                      style={{ width: item.percentage }}
                    ></div>
                  </div>
                  <span className={styles.countryPercentage}>
                    {item.percentage}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ChartContainer>
  );
};

export default GeographicDistribution;
