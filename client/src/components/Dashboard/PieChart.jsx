import React from 'react';
import styles from './Dashboard.module.css';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444'];

const PieChart = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.amount, 0);
  if (total === 0) {
    return (
      <div className={styles.pieChartContainer}>
        <svg
          className={styles.pieChart}
          viewBox="0 0 200 200"
          width="200"
          height="200"
          role="img"
          aria-label="Pie chart showing spending by category"
        >
          <circle cx="100" cy="100" r="80" fill="#f0f0f0" />
          <text x="50%" y="50%" textAnchor="middle" dy=".3em" fill="#999">
            No data
          </text>
        </svg>
      </div>
    );
  }

  let currentAngle = 0;
  const slices = data.map((item, index) => {
    const percentage = (item.amount / total) * 100;
    const angle = (percentage / 100) * 360;
    const startAngle = currentAngle;
    currentAngle += angle;

    return {
      ...item,
      percentage,
      startAngle,
      angle,
      color: COLORS[index % COLORS.length],
    };
  });

  return (
    <div className={styles.pieChartContainer}>
      <svg
        className={styles.pieChart}
        viewBox="0 0 200 200"
        width="200"
        height="200"
        role="img"
        aria-label="Pie chart showing spending by category"
      >
        <circle cx="100" cy="100" r="80" fill="#f0f0f0" />
        {slices.map((slice, index) => {
          if (slice.angle <= 0) return null;

          const startAngle = slice.startAngle - 90;
          const endAngle = startAngle + slice.angle;

          const x1 = 100 + 80 * Math.cos((startAngle * Math.PI) / 180);
          const y1 = 100 + 80 * Math.sin((startAngle * Math.PI) / 180);
          const x2 = 100 + 80 * Math.cos((endAngle * Math.PI) / 180);
          const y2 = 100 + 80 * Math.sin((endAngle * Math.PI) / 180);

          const largeArcFlag = slice.angle > 180 ? 1 : 0;

          const pathData = [
            `M 100 100`,
            `L ${x1} ${y1}`,
            `A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2}`,
            `Z`,
          ].join(' ');

          return (
            <path
              key={index}
              d={pathData}
              fill={slice.color}
              stroke="#fff"
              strokeWidth="2"
            />
          );
        })}
      </svg>

      <div className={styles.pieLegend}>
        {slices.map((slice, index) => (
          <div className={styles.legendItem} key={index}>
            <div
              className={styles.legendColor}
              style={{ backgroundColor: slice.color }}
            />
            <div className={styles.legendLabel}>{slice.category}</div>
            <div className={styles.legendValue}>
              ₹{slice.amount.toLocaleString()} ({slice.percentage.toFixed(1)}%)
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PieChart;
