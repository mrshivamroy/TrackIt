import React from 'react';
import styles from './Dashboard.module.css';

const LineChart = ({ data }) => {
  const maxAmount = Math.max(...data.map(d => d.amount), 1);
  const width = 400;
  const height = 200;
  const padding = 40;

  const points = data.map((item, index) => {
    const x = padding + (index * (width - 2 * padding)) / (data.length - 1);
    const y = height - padding - ((item.amount / maxAmount) * (height - 2 * padding));
    return { x, y, ...item };
  });

  const pathData = points.map((point, index) => {
    return `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`;
  }).join(' ');

  const areaData = `${pathData} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

  return (
    <div className={styles.lineChartContainer}>
      <svg
        className={styles.lineChart}
        width={width}
        height={height}
        role="img"
        aria-label="Line chart showing expenses over the last 7 days"
      >
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
          const y = height - padding - (ratio * (height - 2 * padding));
          return (
            <line
              key={index}
              x1={padding}
              y1={y}
              x2={width - padding}
              y2={y}
              stroke="#e2e8f0"
              strokeWidth="1"
            />
          );
        })}

        {/* Area fill */}
        <path
          d={areaData}
          fill="#6366f1"
          opacity="0.2"
          className={styles.lineArea}
        />

        {/* Line */}
        <path
          d={pathData}
          fill="none"
          stroke="#6366f1"
          strokeWidth="3"
          className={styles.linePath}
        />

        {/* Points */}
        {points.map((point, index) => (
          <circle
            key={index}
            cx={point.x}
            cy={point.y}
            r={6}
            fill="#6366f1"
            stroke="#fff"
            strokeWidth="2"
            className={styles.linePoint}
          />
        ))}

        {/* Labels */}
        {points.map((point, index) => (
          <text
            key={index}
            x={point.x}
            y={height - padding + 20}
            textAnchor="middle"
            fontSize="10"
            fill="#64748b"
          >
            {point.date}
          </text>
        ))}
      </svg>
    </div>
  );
};

export default LineChart;
