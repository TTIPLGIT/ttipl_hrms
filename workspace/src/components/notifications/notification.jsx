import PropTypes from 'prop-types';
import styles from './styles.module.css';

const Notification = ({ notifications, onClick }) => {
  return (
    <div className={styles.notification} onClick={onClick}>
      <div className={styles.header}>
        <h4 className={styles.textstyle}>Notifications</h4>
        <span className={styles.settingsIcon}>⚙️</span>
      </div>
      {notifications.map((notification, index) => (
        <div key={index} className={styles.notificationItem}>
          <img src={notification.avatar} alt={`${notification.user} avatar`} className={styles.avatar} />
          <div className={styles.notificationText}>
            <p><strong>{notification.user}</strong> {notification.message}</p>
            <span className={styles.time}>{notification.time}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

Notification.propTypes = {
  notifications: PropTypes.arrayOf(
    PropTypes.shape({
      message: PropTypes.string.isRequired,
      user: PropTypes.string.isRequired,
      time: PropTypes.string.isRequired,
      avatar: PropTypes.string.isRequired,
    })
  ).isRequired,
  onClick: PropTypes.func,  // Added onClick prop type
};

export default Notification;
