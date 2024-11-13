import { useEffect, useState, useRef } from "react";
import styles from "./styles.module.css";
import Search from "../search/CustomSearch";
import Notification from "../notifications/notification";
import image from "../../assests/images/loginBg.png";

import { useNavigate } from "react-router-dom";

const sideBarList = [
  {
    iconObj: { icon: "pi pi-home", iconColor: "white", iconSize: "1.5rem" },
    text: "Home",
  },
  {
    iconObj: { icon: "pi pi-envelope", iconColor: "white", iconSize: "1.5rem" },
    text: "Mail",
  },
  {
    iconObj: { icon: "pi pi-inbox", iconColor: "white", iconSize: "1.5rem" },
    text: "Inbox",
  },
  {
    iconObj: {
      icon: "pi pi-address-book",
      iconColor: "white",
      iconSize: "1.5rem",
    },
    text: "Book",
  },
];

const notifications = [
  {
    message: "Liked your post",
    user: "John Doe",
    time: "Yesterday",
    avatar: image,
  },
  {
    message: "Commented on your post",
    user: "Jane Smith",
    time: "2 hours ago",
    avatar: image,
  },
];

export default function CustomDrawer({ children }) {
  const [sideOpen, setSideOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 425);
  const [showNotification, setShowNotification] = useState(false);

  const notificationRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 425);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotification(false);
      }
    };

    if (showNotification) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showNotification]);

  const handleIconClick = () => {
    setSideOpen(!sideOpen);
  };

  const topBarIcons = [
    {
      icon: "pi pi-bell",
      action: () => setShowNotification(true),
      badge: { needed: true, severity: "danger", value: "2" },
    },
    {
      icon: "pi pi-user",
      action: () => navigate("/profile"),
    },
  ];

  return (
    <>
      <div className={`p-grid p-nogutter ${styles.topWrapper}`}>
        <div className={`p-col-fixed ${styles.leftContainer}`}>
          <div
            className={`p-col-fixed ${styles.iconWrapper} ${
              isMobile ? "p-d-none" : ""
            }`}
          >
            {!sideOpen ? (
              <i
                className={`pi pi-bars ${styles.bars}`}
                onClick={handleIconClick}
              ></i>
            ) : (
              <i
                className={`pi pi-angle-left ${styles.bars}`}
                onClick={handleIconClick}
              ></i>
            )}
          </div>
          <h3 className={styles.projectName}>Front-End Startup Kit</h3>
        </div>

        {!isMobile && (
          <div className={`p-col p-md-none`}>
            <Search />
          </div>
        )}
        <div className={`p-col-fixed ${styles.navIconsWrapper}`}>
          <div className={styles.navIcons}>
            {topBarIcons.map((prop, index) => (
              <i
                key={index}
                className={`pi ${prop.icon} ${styles.iconStyle} p-overlay-badge`}
                onClick={prop.action}
              ></i>
            ))}
          </div>
        </div>
      </div>

      {showNotification && (
        <div ref={notificationRef}>
          <Notification
            notifications={notifications}
            onClick={() => {
              console.log("Notification clicked");
            }}
          />
        </div>
      )}

      {isMobile && sideOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.closeButton} onClick={handleIconClick}>
              <i className="pi pi-angle-left"></i>
            </div>
            <ul className={styles.sidebarList}>
              {sideBarList.map((value, index) => (
                <li key={index} className={styles.sidebarListItem}>
                  <i
                    className={value.iconObj.icon}
                    style={{
                      fontSize: value.iconObj.iconSize,
                      color: value.iconObj.iconColor,
                    }}
                  />
                  <span className={styles.sidebarText}>{value.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      <main className={sideOpen ? styles.mainOpen : styles.mainClose}>
        {children}
      </main>

      <div className={`p-grid p-nogutter ${styles.wrapper}`}>
        {!isMobile && (
          <div className={sideOpen ? styles.sideBarOpen : styles.sideBarClosed}>
            <div className={styles.iconListWrapper}>
              {sideBarList.map((value, index) => (
                <li
                  key={index}
                  className={
                    sideOpen ? styles.sideBarList : styles.sideBarListClosed
                  }
                >
                  <i
                    className={value.iconObj.icon}
                    style={{
                      fontSize: value.iconObj.iconSize,
                      color: value.iconObj.iconColor,
                    }}
                  />
                  <span className={sideOpen ? styles.text : styles.textHidden}>
                    {value.text}
                  </span>
                </li>
              ))}
            </div>
          </div>
        )}
        <div className="p-col">{/* Add main content here */}</div>
      </div>
    </>
  );
}
