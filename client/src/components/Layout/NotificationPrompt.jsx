import React, { useState, useEffect } from 'react';
import { requestNotificationPermission, showNotification } from '../../utils/notifications.js';
import styles from './Layout.module.css';

const NotificationPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const askedBefore = localStorage.getItem('notificationAsked');

    if (!askedBefore && Notification.permission === 'default') {
      setTimeout(() => setShowPrompt(true), 5000); // Show after 5 seconds
    }
  }, []);

  const handleEnable = async () => {
    const granted = await requestNotificationPermission();

    if (granted) {
      showNotification('Notifications Enabled! 🎉', {
        body: 'You will now receive updates from TrackIt'
      });
    }

    localStorage.setItem('notificationAsked', 'true');
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    localStorage.setItem('notificationAsked', 'true');
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className={styles.notificationPrompt}>
      <div className={styles.notificationContent}>
        <div className={styles.notificationIcon}>🔔</div>
        <div className={styles.notificationText}>
          <strong>Enable Notifications?</strong>
          <p>Stay updated with your expense tracking</p>
          <div className={styles.notificationActions}>
            <button className={styles.enableBtn} onClick={handleEnable}>
              Enable
            </button>
            <button className={styles.noThanksBtn} onClick={handleDismiss}>
              No Thanks
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationPrompt;
