import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteDetails, selectLoggedUser } from "../../pages/login/loginSlice";
import { deleteUser } from "../../pages/user/userSlice";
import { _capitalize } from "chart.js/helpers";
import styles from "./styles.module.css";
import image from "../../assests/images/loginBg.png";
import logo from "../../assests/images/hrmslogo.png";
import profile from "../../assests/images/profile.png";
import Notification from "../notifications/notification";
import { TieredMenu } from "primereact/tieredmenu";
import {
  resetAttendance,
  selectAttendanceId,
  selectAttendanceStatus,
} from "../../hrms/pages/attendance/attendanceSlice";

export default function Menu({ setVisible }) {
  const [time, setTime] = useState(new Date());
  const [openStatusTab, setOpenStatusTab] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");

  const statusColors = {
    Active: "bg-green-600",
    Away: "bg-yellow-500",
    Busy: "bg-red-600",
    Offline: "bg-gray-600",
  };

  const dispatch = useDispatch();
  const loggedUser = useSelector(selectLoggedUser);
  const attendanceId = useSelector(selectAttendanceId); // Access the attendanceId from Redux
  const activeColor = useSelector(selectAttendanceStatus);

  const loggedUserName = loggedUser.userName;
  const loggedUserRole = loggedUser.role;
  const imgSrc = loggedUser.img;
  const atdId = attendanceId;
  const statusActive = activeColor; // Default to "idle" if attendanceId is null
  const navigate = useNavigate();
  const [showNotification, setShowNotification] = useState(false);
  const notificationRef = useRef(null);
  const menu = useRef(null);
  const statusRef = useRef(null); // Reference for status box

  const handleLogout = () => {
    dispatch(deleteUser([]));
    dispatch(deleteDetails());
    dispatch(resetAttendance());

    navigate("/"); // Redirect to home or login page
  };

  const handleProfile = () => {
    navigate("/my_profile/view");
  };

  const items = [
    ...(loggedUserRole.toLowerCase() !== "admin"
      ? [
          {
            label: "Profile",
            icon: "pi pi-fw pi-user",
            command: handleProfile, // Trigger profile when clicked
          },
        ]
      : []), // If user is admin, do not include the profile item
    {
      label: "Logout",
      icon: "pi pi-fw pi-sign-out",
      command: handleLogout, // Trigger logout when clicked
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        statusRef.current &&
        !statusRef.current.contains(event.target) &&
        !event.target.closest(".statusDot")
      ) {
        setOpenStatusTab(false); // Close the status box if clicked outside
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotification(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Current Time
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer); // Clean up the interval on component unmount
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const handleStatusClick = () => {
    setOpenStatusTab((prevState) => !prevState); // Toggle the state
  };

  // Inside the Menu component
  useEffect(() => {
    if (statusActive === "active") {
      setSelectedStatus("Active");
    } else if (statusActive === "offline") {
      setSelectedStatus("Offline");
    }
  }, [statusActive]); // This hook runs only when statusActive changes

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
    setOpenStatusTab(false);
  };

  return (
    <>
      <div
        style={{
          backgroundColor: `var(--primary-light)`,
          height: "8%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          color: "var(--text-white)",
          paddingLeft: "10px",
          paddingRight: "15px",
        }}
      >
        <i
          className="pi pi-bars ml-3 text-2xl lg:hidden"
          onClick={() => setVisible(true)}
          style={{ color: "var(--text-white)" }}
        ></i>

        <p
          className="ml-2 font-semibold text-lg lg:text-2xl"
          style={{ color: "var(--text-white)" }}
        >
          <img style={{ width: "70px" }} src={logo} />
        </p>
        <p
          className="ml-2 font-semibold text-lg lg:text-2xl hidden sm:block"
          style={{ color: "var(--text-white)" }}
        >
          Human Resource Management System
        </p>

        <div
          className={`flex align-items-center justify-content-center gap-2 ${styles.profileImageWrapper}`}
        >
          <p className="text-center text-base font-base text-gray-800 my-0 ">
            <span className="text-white rounded">{formatTime(time)}</span>
          </p>

          <i
            className="fa-solid fa-bell text-lg lg:text-xl border-circle p-1 cursor-pointer"
            style={{ color: "var(--text-white)" }}
            onClick={() => setShowNotification(!showNotification)}
          />
          <div className="flex gap-2">
            <p
              className="text-sm font-semibold text-white m-0 cursor-pointer"
              style={{ display: "flex", flexDirection: "column" }}
            >
              <div>{_capitalize(loggedUserName)}</div>
              <div className="text-xs font-light">{loggedUserRole}</div>
            </p>
            <img
              src={imgSrc || profile}
              onClick={(event) => menu.current.toggle(event)}
            />

            <span
              className={`${styles.statusDot} ${
                statusColors[selectedStatus] || "bg-gray-600"
              }`}
              onClick={handleStatusClick}
            />

            {openStatusTab && (
              <div className={styles.statusBox} ref={statusRef}>
                <p onClick={() => handleStatusChange("Active")}>Active</p>
                <p onClick={() => handleStatusChange("Away")}>Away</p>
                <p onClick={() => handleStatusChange("Busy")}>Busy</p>
                <p onClick={() => handleStatusChange("Offline")}>Offline</p>
              </div>
            )}

            <div className="">
              <TieredMenu
                className="w-1 mt-2 text-sm h-1"
                model={items}
                popup
                ref={menu}
              />
            </div>
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
    </>
  );
}
