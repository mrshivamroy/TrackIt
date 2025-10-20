import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext.jsx';
import Login from './components/Auth/Login.jsx';
import Register from './components/Auth/Register.jsx';
import Dashboard from './components/Dashboard/Dashboard.jsx';
import TransactionList from './components/Transactions/TransactionList.jsx';
import Navbar from './components/Layout/Navbar.jsx';
import InstallPrompt from './components/Layout/InstallPrompt.jsx';
import NotificationPrompt from './components/Layout/NotificationPrompt.jsx';
import styles from './App.module.css';

function App() {
  const [view, setView] = useState('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      setView('dashboard');
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setView('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setView('login');
  };

  return (
    <AuthProvider>
      <div className={styles.appContainer}>
        {/* Show Navbar and prompts only if authenticated */}
        {isAuthenticated && (
          <>
            <Navbar onLogout={handleLogout} setView={setView} />
            <InstallPrompt />
            <NotificationPrompt />
          </>
        )}

        {/* Views */}
        {!isAuthenticated && view === 'login' && (
          <Login onLogin={handleLogin} onSwitchToRegister={() => setView('register')} />
        )}

        {!isAuthenticated && view === 'register' && (
          <Register onRegister={handleLogin} onSwitchToLogin={() => setView('login')} />
        )}

        {isAuthenticated && view === 'dashboard' && <Dashboard />}

        {isAuthenticated && view === 'transactions' && <TransactionList />}
      </div>
    </AuthProvider>
  );
}

export default App;
