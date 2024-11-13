import Menu from "../../../components/drawer/Menu";
import landing from "../../../assests/images/landingPage/landing.png";
import "./landingpage.css";
import { protectedCall } from "../../../services/userService";
import attendance from "../../../assests/images/landingPage/attendance.png";
import payroll from "../../../assests/images/landingPage/payroll.png";
import announcement from "../../../assests/images/landingPage/announcement.png";
import appraisal from "../../../assests/images/landingPage/appraisal.png";
import leave from "../../../assests/images/landingPage/leave.png";
import dashboard from "../../../assests/images/landingPage/dashboard.png";
import organization from "../../../assests/images/landingPage/organization.png";
import employee from "../../../assests/images/landingPage/employee.png";
import complaints from "../../../assests/images/landingPage/complaints.png";
import profile from "../../../assests/images/landingPage/profile.png";
import asset from "../../../assests/images/landingPage/asset.png";
import admin from "../../../assests/images/landingPage/admin.png";
import inventory from "../../../assests/images/landingPage/inventory.png";
import requirement from "../../../assests/images/landingPage/requirement.png";
import recruitment from "../../../assests/images/landingPage/recruitment.png";
import manager from "../../../assests/images/landingPage/manager.png";
import task from "../../../assests/images/landingPage/task.png";
import Search from "../../../components/search/CustomSearch";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteDetails,
  selectLoggedUser,
} from "../../../pages/login/loginSlice";
import { deleteUser } from "../../../pages/user/userSlice";
import { InputText } from "primereact/inputtext";
import { capitalize } from "../../../utils/helper";

const imageMap = {
  announcement: announcement,
  teamattendance: attendance,
  attendance: attendance,
  tasktracker: task,
  payroll: payroll,
  appraisal: appraisal,
  leave: leave,
  dashboard: dashboard,
  employee: employee,
  leavetracker: leave,
  admintest: attendance,
  submodule: appraisal,
  organization: organization,
  asset: asset,
  myasset: asset,
  complaints: complaints,
  mycomplaints: complaints,
  myprofile: profile,
  inventory: inventory,
  admin: admin,
  assettype: asset,
  recruitment: recruitment,
  requirementraising: requirement,
  manager: manager,
};

const LandingPage = () => {
  const dispatch = useDispatch();
  const loggedUser = useSelector(selectLoggedUser);

  const navigate = useNavigate(); // Hook for navigation

  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term

  useEffect(() => {
    const fetchData = async () => {
      try {
        const newData = await protectedCall(
          `/api/menu-creator/${loggedUser?.id}`
        );
        console.log("Sidebar data check", newData);
        setData(newData);
      } catch (error) {
        console.error("Error fetching sidebar data", error);
      }
    };
    fetchData();
  }, [loggedUser?.id]);

  const handleModuleClick = (route) => {
    navigate(route); // Navigate to the respective route
  };

  const getModuleImage = (moduleName) => {
    const key = moduleName.trim().toLowerCase().replace(/\s+/g, ""); // Remove spaces
    return imageMap[key];
  };

  // Filter modules based on search term
  const filteredData = data?.filter(
    (i) =>
      i.moduleName.toLowerCase() !== "landing page" &&
      i.moduleName.toLowerCase() !== "asset type" &&
      i.moduleName.toLowerCase() !== "settings" &&
      i.moduleName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div
        style={{
          height: "100vh",
          overflow: "hidden",
        }}
      >
        <Menu />

        <div className="landing-container flex sm:flex-column lg:flex-row">
          {/* Left Section for Illustration */}
          <div className="illustration-section hidden sm:block w-full">
            <img
              src={landing}
              alt="Illustration"
              className="illustration-img"
            />
          </div>

          {/* Right Section for Modules */}
          <div className="flex flex-column gap-5 lg:p-4 w-full ">
            <div className="flex  justify-content-between">
              <div className="flex gap-1 lg:gap-3 align-items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  version="1.1"
                  viewBox="0 0 512 512"
                  width="25"
                  height="25"
                >
                  <g>
                    <path d="M85.333,0h64c47.128,0,85.333,38.205,85.333,85.333v64c0,47.128-38.205,85.333-85.333,85.333h-64C38.205,234.667,0,196.462,0,149.333v-64C0,38.205,38.205,0,85.333,0z" />
                    <path d="M362.667,0h64C473.795,0,512,38.205,512,85.333v64c0,47.128-38.205,85.333-85.333,85.333h-64c-47.128,0-85.333-38.205-85.333-85.333v-64C277.333,38.205,315.538,0,362.667,0z" />
                    <path d="M85.333,277.333h64c47.128,0,85.333,38.205,85.333,85.333v64c0,47.128-38.205,85.333-85.333,85.333h-64C38.205,512,0,473.795,0,426.667v-64C0,315.538,38.205,277.333,85.333,277.333z" />
                    <path d="M362.667,277.333h64c47.128,0,85.333,38.205,85.333,85.333v64C512,473.795,473.795,512,426.667,512h-64c-47.128,0-85.333-38.205-85.333-85.333v-64C277.333,315.538,315.538,277.333,362.667,277.333z" />
                  </g>
                </svg>

                <p className="lg:text-4xl text-2xl font-bold m-0 text-gray-900">
                  Modules
                </p>
              </div>
              <InputText
                className="lg:p-2 p-1 border-2 border-gray-300 w-6 lg:w-4"
                style={{
                  backgroundColor: "#ffffff",
                  color: "#000000",
                  fontWeight: " ",
                }}
                placeholder="Search Modules..."
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="modules-section">
              <div className="modules-grid">
                {filteredData
                  ?.sort((a, b) => a.moduleName.localeCompare(b.moduleName)) // Sort in alphabetical order
                  .map((i, index) => (
                    <div
                      key={index}
                      className="module-item"
                      onClick={() => handleModuleClick(i.moduleRoute)}
                    >
                      <img
                        src={getModuleImage(i.moduleName)}
                        alt={`${i.moduleName} Icon`}
                        className="module-icon w-6 lg:w-6"
                      />
                      <h2 className="module-title text-base lg:text-lg">
                        {capitalize(i.moduleName)}
                      </h2>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LandingPage;
