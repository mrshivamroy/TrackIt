import React from 'react';
import styles from './Layout.module.css';

const Navbar = ({ currentView, setView, onLogout }) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        {/* Logo */}
        <h1 className={styles.logo}>💰 TrackIt</h1>

        {/* Navigation buttons */}
        <div className={styles.navLinks}>
          <button
            className={currentView === 'dashboard' ? styles.active : ''}
            onClick={() => setView('dashboard')}
          >
            Dashboard
          </button>
          <button
            className={currentView === 'transactions' ? styles.active : ''}
            onClick={() => setView('transactions')}
          >
            Transactions
          </button>
        </div>

        {/* User section */}
        <div className={styles.userSection}>
          <span className={styles.userName}>👋 {user.name}</span>
          <button className={styles.logoutBtn} onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
