import { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { Ripple } from "primereact/ripple";
import { useLocation, useNavigate } from "react-router-dom";
import Menu from "./Menu";
import styles from "./styles.module.css";
import { useDispatch, useSelector } from "react-redux";
import { deleteDetails, selectLoggedUser } from "../../pages/login/loginSlice";
import { deleteUser } from "../../pages/user/userSlice";
import { protectedCall } from "../../services/userService";
import { capitalize } from "../../utils/helper";
import { resetAttendance } from "../../hrms/pages/attendance/attendanceSlice";

export default function Drawer({ children }) {
  const [originalData, setOriginalData] = useState([]);
  const [currentScreen, setCurrentScreen] = useState("");
  const location = useLocation();
  console.log(location.pathname, "location.pathname");
  console.log(currentScreen, "currentScreen");

  const navigate = useNavigate();

  const [visible, setVisible] = useState(false);

  const dispatch = useDispatch();
  const loggedUser = useSelector(selectLoggedUser);

  useEffect(() => {
    if (loggedUser?.role === undefined) {
      navigate("/");
    }
  }, [loggedUser?.role, navigate]);

  console.log("originalData", originalData);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const newData = await protectedCall(
          `/api/menu-creator/${loggedUser?.id}`
        );
        setOriginalData(newData);
      } catch (error) {
        console.error("Error fetching sidebar data", error);
      }
    };
    fetchData();
  }, [loggedUser?.id]);

  function convertToSidebarFormat(data) {
    return data
      ?.map((module) => ({
        div: module.moduleName,
        moduleIcon: module.moduleIcon,
        moduleId: module.moduleId,
        li: [
          // Add screens at the module level
          ...module.screens.map((screen) => ({
            icon: module.moduleIcon, // Default icon, customize as needed
            name: screen.screenName,
            screenId: screen.screenId,
            click: () => {
              setCurrentScreen(screen.screenRoute); // Set active screen on click

              navigate(screen.screenRoute, {
                state: { screenId: screen.screenId },
              });
            },
          })),
          // Add sub-modules if they exist
          ...module.subModules.map((subModule) => ({
            icon: "", // Default icon for sub-modules, customize as needed
            name: subModule.subModuleName,
            li: subModule.subModuleScreens.map((subScreen) => ({
              icon: "", // Default icon for sub-screens, customize as needed
              name: subScreen.screenName,
              screenId: subScreen.screenId,
              click: () => {
                setCurrentScreen(screen.screenRoute); // Set active screen on click

                navigate(subScreen.screenRoute, {
                  state: { screenId: subScreen.screenId },
                });
              },
            })),
          })),
        ],
      }))

      ?.reverse();
  }

  const sideBar = convertToSidebarFormat(
    originalData?.length ? originalData : []
  );

  const [width, setWidth] = useState("2");

  // State to keep track of which menu sections and submenus are open.
  const [openSections, setOpenSections] = useState({});

  // Toggle the open/closed state of menu sections or submenus
  const toggleSection = (key) => {
    setOpenSections((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  const renderMenuItems = (items, parentKey) => {
    return items.map((item, index) => {
      const itemKey = `${parentKey}-${index}`;
      const hasChildren = item.li && item.li.length > 0;

      return (
        <li key={index} className="p-mb-2">
          {hasChildren ? (
            <>
              <div
                className={`${styles.screens} p-ripple flex align-items-center cursor-pointer p-3 border-round transition-duration-150 transition-colors w-full`}
                style={
                  width === "2"
                    ? {
                        color: "var(--text-white)",
                      }
                    : {
                        justifyContent: "space-between",
                        color: "var(--text-white)",
                      }
                }
                onClick={() => toggleSection(itemKey)}
              >
                <i
                  className={`${item.icon} `}
                  style={
                    width === "2"
                      ? { color: "var(--text-white)" }
                      : { fontSize: "20px", color: "var(--text-white)" }
                  }
                ></i>
                {width === "2" && (
                  <span
                    // style={{ color: "var(--text-light)" }}
                    className="font-medium ml-3"
                  >
                    {item.name}
                  </span>
                )}
                <i
                  style={{ color: "var(--text-white)" }}
                  className={
                    width !== "2" ? "pi pi-chevron-down" : "pi pi-chevron-down"
                  }
                ></i>
                <Ripple />
              </div>
              {openSections[itemKey] && (
                <ul className="list-none py-0 pl-3 pr-0 m-0">
                  {renderMenuItems(item.li, itemKey)}
                </ul>
              )}
            </>
          ) : (
            <a
              onClick={item.click}
              className={`${styles.screens} 
              p-ripple flex align-items-center cursor-pointer px-2 py-3 border-round transition-duration-150 transition-colors w-full
              ${
                width === "2"
                  ? "text-gray-400 hover:text-white"
                  : "text-gray-400 hover:text-white"
              }
              `}
              style={
                width === "2"
                  ? { color: "var(--text-light)" }
                  : { justifyContent: "center", color: "var(--text-light)" }
              }
            >
              {items.length === 1 && (
                <i
                  className={`${item.icon} ${
                    width === "2" ? "text-lg" : "text-2xl"
                  } mr-3`}
                  // style={
                  //   width === "2"
                  //     ? { color: "var(--text-light)" }
                  //     : { fontSize: "20px", color: "var(--text-light)" }
                  // }
                ></i>
              )}
              {width === "2" && (
                <span className="font-medium">{item.name}</span>
              )}
              <Ripple />
            </a>
          )}
        </li>
      );
    });
  };

  // Define your custom order
  const adminOrder = [
    "Dashboard",
    "Landing page",
    "My asset",
    "admin",
    "Manager",
    "Complaints",
    "Organization",
    "employee",
    "Recruitment",
    "Requirement raising",
    "Asset type",
    "Attendance",
    "Task Tracker",
    "Team Attendance",
    "Asset",
    "Inventory",
    "Settings",
  ];

  const employeeOrder = [
    "Dashboard",
    "Landing page",
    "My Profile",
    "My asset",
    "Attendance",
    "Task Tracker",
    "Complaints",
    "Leave Tracker",
  ];

  // Function to get order based on role
  function getOrderByRole(role) {
    if (role.toLowerCase() === "Admin".toLowerCase()) return adminOrder;
    if (role.toLowerCase() === "Employee".toLowerCase()) return employeeOrder;
    return adminOrder; // Default to an empty array if no role matches
  }

  const userRole = loggedUser.role; // or "admin" based on login
  const customOrder = getOrderByRole(userRole);

  // Sort the sidebar array based on the customOrder array
  const orderedSideBar = sideBar
    .filter((item) =>
      customOrder
        .map((div) => div.toLowerCase())
        .includes(item.div.toLowerCase())
    ) // Convert both to lowercase for filtering
    .sort(
      (a, b) =>
        customOrder
          .map((div) => div.toLowerCase())
          .indexOf(a.div.toLowerCase()) -
        customOrder.map((div) => div.toLowerCase()).indexOf(b.div.toLowerCase())
    ); // Convert to lowercase for sorting

  return (
    <div
      style={{
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <Menu setVisible={setVisible} />

      <div className="grid" style={{ margin: "0px" }}>
        {/* <div className="grid min-h-screen" style={{ margin: "0px",position: "fixed" }}> */}
        <div className={`hidden lg:flex lg:col-${width} p-0`}>
          <div
            style={{
              background: "#0B192C",
              width: "100%",
            }}
          >
            <div className="flex justify-content-end px-3 ">
              <p
                className="text-2xl "
                style={{ color: "var(--text-white)" }}
              ></p>

              <span className="text-2xl font-semibold py-2 m-0">
                <Button
                  type="button"
                  icon={
                    width === "2"
                      ? "fa-solid fa-bars outline"
                      : "pi pi-chevron-right text-xs "
                  }
                  className="bg-transparent outline-none shadow-none border-none"
                  onClick={() => {
                    setWidth((prev) => (prev === "2" ? "1" : "2"));
                    setOpenSections([]);
                  }}
                ></Button>
              </span>
            </div>
            <div className={styles.scroll}>
              {orderedSideBar.map((elem, index) => {
                const sectionKey = `section-${index}`;

                return (
                  <ul key={index} className="list-none px-2 m-0">
                    <li>
                      {elem.li.length === 1 ? (
                        // If `li` has a single item, render directly without wrapping `div`
                        <ul className="list-none p-0 m-0 ">
                          {renderMenuItems(elem.li, sectionKey)}
                        </ul>
                      ) : (
                        <>
                          <div
                            className={` p-ripple px-2  py-3 flex align-items-center ${
                              width === "2"
                                ? "justify-content-between"
                                : "justify-content-center"
                            } text-600 cursor-pointer text-gray-400 hover:text-white`}
                            onClick={() =>
                              width === "2" && toggleSection(sectionKey)
                            }
                          >
                            <span>
                              <i
                                className={`${elem?.moduleIcon} mr-3 ${
                                  width === "2" ? "text-lg" : "text-2xl"
                                }`}
                              />
                              <span
                                className={
                                  width === "2"
                                    ? "font-medium "
                                    : "font-medium  hidden "
                                }
                              >
                                {capitalize(elem.div)}
                              </span>
                            </span>
                            {/* open side menu  */}
                            {width === "2" && (
                              <i className="pi pi-chevron-down text-sm"></i>
                            )}
                            <Ripple />
                          </div>
                          {/* sub module laptop*/}
                          {openSections[sectionKey] && (
                            <ul
                              className={`list-disc text-gray-400 hover:text-white m-0 ml-6`}
                              style={{
                                borderRadius: "5px",
                                paddingLeft: "5px",
                              }}
                            >
                              {renderMenuItems(elem.li, sectionKey)}
                            </ul>
                          )}
                        </>
                      )}
                    </li>
                  </ul>
                );
              })}
            </div>
            <div>
              <hr className=" mx-3 border-top-1 border-none surface-border" />
              <a
                className="m-3 flex align-items-center cursor-pointer p-3 gap-2 border-round  font-semibold  transition-duration-150 transition-colors p-ripple"
                style={{
                  justifyContent: "center",
                  color: "var(--text-white)",
                }}
                onClick={() => {
                  dispatch(deleteDetails());
                  dispatch(resetAttendance());

                  navigate("/");
                }}
              >
                <i className="pi pi-sign-out" />
                Logout
              </a>
            </div>
          </div>
        </div>
        <div
          style={{ flexDirection: "column", overflow: "hidden" }}
          className={`col-12 lg:col-${width === "2" ? "10" : "11"} p-0`}
        >
          <main style={{ marginLeft: "1%", marginRight: "1%" }}>
            {children}
          </main>
        </div>
      </div>

      <div
        style={{
          display: visible ? "flex" : "none",
          justifyContent: "center",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          zIndex: "1000",
          color: "var(--text-white)",
        }}
        className="lg:hidden"
      >
        <div
          className="flex flex-column h-full"
          style={{
            backgroundColor: `var(--primary-color)`,
            overflow: "hidden",
          }}
        >
          <div className="flex align-items-center justify-content-between px-4 pt-3 flex-shrink-0">
            <span className="flex align-items-center justify-content-center ">
              <img
                src={
                  width === "2"
                    ? import.meta.env.VITE_LOGO_Large
                    : import.meta.env.VITE_LOGO_Small
                }
                width={"50%"}
                alt="logo"
              />
            </span>
            <span>
              <Button
                type="button"
                icon={"pi pi-times"}
                style={{ color: "var(--text-white)" }}
                rounded
                outlined
                className="h-2rem w-2rem"
                onClick={() => setVisible(false)}
              ></Button>
            </span>
          </div>
          <div className="overflow-y-none">
            {sideBar.map((elem, index) => {
              const mobileSectionKey = `mobile-section-${index}`;
              return (
                <ul key={index} className="list-none p-2 m-0">
                  <li>
                    {elem.div ? (
                      <>
                        <div
                          className="p-ripple p-3 flex align-items-center justify-content-between text-600 cursor-pointer"
                          onClick={() => toggleSection(mobileSectionKey)}
                        >
                          <span
                            className={
                              width === "2"
                                ? "font-medium "
                                : "font-medium text-sm "
                            }
                            style={{ color: "var(--text-white)" }}
                          >
                            {elem.div}
                          </span>
                          <i
                            className="pi pi-chevron-down "
                            style={{ color: "var(--text-white)" }}
                          ></i>
                          <Ripple />
                        </div>
                        {/* sub module phone*/}
                        {openSections[mobileSectionKey] && (
                          <div className="absolute">
                            <ul className="list-none p-0 m-0 relative">
                              {renderMenuItems(elem.li, mobileSectionKey)}
                            </ul>
                          </div>
                        )}{" "}
                      </>
                    ) : (
                      <>
                        <ul className="list-none p-0 m-0">
                          {renderMenuItems(elem.li, mobileSectionKey)}
                        </ul>
                      </>
                    )}
                  </li>
                </ul>
              );
            })}
          </div>
          <div className="mt-auto">
            <hr className="mb-3 mx-3 border-top-1 border-none surface-border" />
            <a
              className="m-3 flex align-items-center cursor-pointer p-3 gap-2 border-round  font-semibold  transition-duration-150 transition-colors p-ripple"
              style={{
                justifyContent: "center",
                color: "var(--text-white)",
              }}
              onClick={() => {
                dispatch(deleteUser([]));
                dispatch(deleteDetails());
                navigate("/");
              }}
            >
              <i className="pi pi-sign-out" />
              Logout
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
