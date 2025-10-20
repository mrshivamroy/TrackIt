import React, { useState, useEffect } from 'react';
import { api } from '../../utils/api.js';
import PieChart from './PieChart.jsx';
import LineChart from './LineChart.jsx';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsData, transactionsData] = await Promise.all([
        api.getStats(),
        api.getTransactions()
      ]);
      setStats(statsData);
      setTransactions(transactionsData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  const categoryData = stats?.categoryBreakdown || {};
  const chartData = Object.entries(categoryData).map(([category, amount]) => ({
    category,
    amount
  }));
  
  // Prepare line chart data (last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split('T')[0];
  });

  const expensesByDate = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      const date = new Date(t.date).toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + t.amount;
      return acc;
    }, {});

  const lineChartData = last7Days.map(date => ({
    date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    amount: expensesByDate[date] || 0
  }));

  return (
    <div className={styles.dashboard}>
      <h1 className={styles.title}>Dashboard Overview</h1>

      <div className={styles.statsGrid}>
        <div className={`${styles.statCard} ${styles.income}`}>
          <div className={styles.statIcon}>💵</div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Total Income</div>
            <div className={styles.statValue}>
              ₹{stats?.totalIncome?.toLocaleString() || 0}
            </div>
          </div>
        </div>

        <div className={`${styles.statCard} ${styles.expense}`}>
          <div className={styles.statIcon}>💸</div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Total Expense</div>
            <div className={styles.statValue}>
              ₹{stats?.totalExpense?.toLocaleString() || 0}
            </div>
          </div>
        </div>

        <div className={`${styles.statCard} ${styles.balance}`}>
          <div className={styles.statIcon}>💰</div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Current Balance</div>
            <div className={styles.statValue}>
              ₹{stats?.balance?.toLocaleString() || 0}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.chartsGrid}>
        <div className={styles.chartCard}>
          <h3>Spending by Category</h3>
          {chartData.length > 0 ? (
            <PieChart data={chartData} />
          ) : (
            <div className={styles.noData}>No expense data available</div>
          )}
        </div>

        <div className={styles.chartCard}>
          <h3>Expenses Over Time (Last 7 Days)</h3>
          <LineChart data={lineChartData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
