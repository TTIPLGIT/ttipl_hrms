import CommonChart from "../components/chart/commonChart/CommonChart";

import User from "../pages/user/User";

import UserAdd from "../pages/user/UserAdd";
import UserEdit from "../pages/user/UserEdit";
import UserView from "../pages/user/UserView";
import UamMenu from "../components/uam/UamMenu";
import RolePermissionsEditAndView from "../pages/rbac/RolePermissionsEdit&View";
import Roles from "../pages/rbac/Roles";
import AddRole from "../pages/rbac/AddRole";
import Organization from "../hrms/pages/organization/Organization";
import OrganizationAdd from "../hrms/pages/organization/OrganizationAdd";
import OrganizationView from "../hrms/pages/organization/OrganizationView";
import OrganizationEdit from "../hrms/pages/organization/OrganizationEdit";
import EmployeeList from "../hrms/pages/employee/EmployeeList";
import EmployeeAdd from "../hrms/pages/employee/EmployeeAdd";
import EmployeeEdit from "../hrms/pages/employee/EmployeeEdit";
import EmployeeView from "../hrms/pages/employee/EmployeeView";
import LandingPage from "../hrms/pages/landingPage/LandingPage";
import AttendancePage from "../hrms/pages/attendance/AttendancePage";
import AppraisalPage from "../hrms/pages/appraisal/AppraisalPage";
import PayrollPage from "../hrms/pages/payroll/PayrollPage";
import LeaveTrackerPage from "../hrms/pages/leavetracker/LeaveTrackerPage";
import AnnouncementPage from "../hrms/pages/announcement/AnnouncementPage";
import Asset from "../hrms/pages/asset/Asset";
import Inventory from "../hrms/pages/asset/Inventory";
import AssetType from "../hrms/pages/asset/AssetType";
import AssetView from "../hrms/pages/asset/assetFun/AssetView";
import AssetList from "../hrms/pages/asset/assetFun/AssetList";
import AssetEdit from "../hrms/pages/asset/assetFun/AssetEdit";
import AssetListType from "../hrms/pages/asset/assetTypeFun/AssetTypeList";
import InventoryList from "../hrms/pages/asset/inventoryFun/InventoryList";
import InventoryView from "../hrms/pages/asset/inventoryFun/InventoryView";
import InventoryEdit from "../hrms/pages/asset/inventoryFun/InventoryEdit";
import ComplaintsAdd from "../hrms/pages/complaints/ComplaintsAdd";
import ComplaintsEdit from "../hrms/pages/complaints/ComplaintsEdit";
import ComplaintsView from "../hrms/pages/complaints/ComplaintsView";
import ComplaintsList from "../hrms/pages/complaints/ComplaintsList";
import AssetTypeEdit from "../hrms/pages/asset/assetTypeFun/AssetTypeEdit";
import AssetTypeView from "../hrms/pages/asset/assetTypeFun/AssetTypeView";
import MyProfile from "../hrms/pages/profile/MyProfile";
import MyProfileEdit from "../hrms/pages/profile/MyProfileEdit";
import MyComplaints from "../hrms/pages/myComplaints/MyComplaints";
import MyAsset from "../hrms/pages/myAsset/MyAsset";
import Dashboard from "../hrms/pages/dashboard/Dashboard";
import RequirementRaising from "../hrms/pages/requirementRaising/RequirementRaising";
import OpenRequirements from "../hrms/pages/requirementRaising/OpenRequirements";
import ClosedRequirements from "../hrms/pages/requirementRaising/ClosedRequirements";
import JobApplication from "../hrms/pages/recruitmentProces/JobApplication";
import AppliedCandidates from "../hrms/pages/recruitmentProces/AppliedCandidates";
import InterviewScheduledCandidates from "../hrms/pages/recruitmentProces/InterviewScheduledCandidates";
import SelectedCandidates from "../hrms/pages/recruitmentProces/SelectedCandidates";
import OfferedCandidates from "../hrms/pages/recruitmentProces/OfferedCandidates";
import RejectedCandidates from "../hrms/pages/recruitmentProces/RejectedCandidates";
import DeclinedCandidates from "../hrms/pages/recruitmentProces/DeclinedCandidates";
import YourOffer from "../hrms/pages/recruitmentProces/YourOffer";
import Department from "../hrms/pages/asset/settings/Department";
import Designation from "../hrms/pages/asset/settings/Designation";
import EditClosedRequirement from "../hrms/pages/requirementRaising/EditClosedRequirement";
import EditOpenRequirement from "../hrms/pages/requirementRaising/EditOpenRequirement";
import ViewClosedRequirement from "../hrms/pages/requirementRaising/ViewClosedRequirement";
import ViewOpenRequirement from "../hrms/pages/requirementRaising/ViewOpenRequirement";
import ViewAppliedCandidates from "../hrms/pages/recruitmentProces/ViewAppliedCandidates";
import EditAppliedCandidates from "../hrms/pages/recruitmentProces/EditAppliedCandidates";
import ApplyLeave from "../hrms/pages/leavetracker/applyLeave/ApplyLeave";
import RequestedLeave from "../hrms/pages/leavetracker/applyLeave/RequestedLeave";
import ApprovedLeave from "../hrms/pages/leavetracker/applyLeave/ApprovedLeave";
import RejectedLeave from "../hrms/pages/leavetracker/applyLeave/RejectedLeave";
import TeamLeaves from "../hrms/pages/leavetracker/applyLeave/TeamLeaves";
import LeaveRequests from "../hrms/pages/leavetracker/applyLeave/LeaveRequests";
import ManagerRejectedLeaves from "../hrms/pages/leavetracker/applyLeave/ManagerRejectedLeaves";
import DepartmentList from "../hrms/pages/asset/settings/DepartmentList";
import DepartmentView from "../hrms/pages/asset/settings/DepartmentView";
import DepartmentEdit from "../hrms/pages/asset/settings/DepartmentEdit";
import DesignationView from "../hrms/pages/asset/settings/DesignationView";
import DesignationEdit from "../hrms/pages/asset/settings/DesignationEdit";
import DesignationList from "../hrms/pages/asset/settings/DesignationList";
import LeaveTypeList from "../hrms/pages/leavetracker/LeaveTypeList";
import LeaveTypeView from "../hrms/pages/leavetracker/LeaveTypeView";
import LeaveTypeEdit from "../hrms/pages/leavetracker/LeaveTypeEdit";
import TaskTracker from "../hrms/pages/taskTracker/TaskTracker";
import TaskTrackerList from "../hrms/pages/taskTracker/TaskTrackerList";
import TeamAttendanceList from "../hrms/pages/attendance/TeamAttendanceList";

// .

const routes = [
  {
    path: "/products_list",
    name: "User",
    element: <User />,
  },
  {
    path: "/products_list/add",
    name: "Add User",
    element: <UserAdd />,
  },
  {
    path: "/products_list/edit",
    name: "Edit User",
    element: <UserEdit />,
  },
  {
    path: "/products_list/view",
    name: "View User",
    element: <UserView />,
  },
  {
    path: "/dashboard",
    name: "dashboard",
    // element: <CommonChart />,
    element: <Dashboard />,
  },

  {
    path: "/menu_builder",
    name: "Menu Builder",
    element: <UamMenu />,
  },

  {
    path: "/role_permissions",
    name: "Role Permissions",
    element: <Roles />,
  },
  {
    path: "/role_permissions/edit",
    name: "Role Permissions Edit",
    element: <RolePermissionsEditAndView />,
  },
  {
    path: "/role_permissions/view",
    name: "Role Permissions View",
    element: <RolePermissionsEditAndView />,
  },
  {
    path: "/role_permissions/add_Role",
    name: "Add Role",
    element: <AddRole />,
  },

  //Organization routes
  {
    path: "/organization_list",
    name: "Organization List",
    element: <Organization />,
  },
  {
    path: "/organization_list/add",
    name: "Organization Add",
    element: <OrganizationAdd />,
  },
  {
    path: "/organization_list/view",
    name: "Organization view",
    element: <OrganizationView />,
  },
  {
    path: "/organization_list/edit",
    name: "Organization Edit",
    element: <OrganizationEdit />,
  },

  //employee route

  {
    path: "/employee_list",
    name: "Employee List",
    element: <EmployeeList />,
  },
  {
    path: "/employee_list/view",
    name: "Employee View",
    element: <EmployeeView />,
  },
  {
    path: "/employee_list/add",
    name: "Employee Add",
    element: <EmployeeAdd />,
  },
  {
    path: "/employee_list/edit",
    name: "Employee Edit",
    element: <EmployeeEdit />,
  },

  // landing page

  // HR manager routes
  {
    path: "/announcement ",
    name: "Announcement",
    element: <AnnouncementPage />,
  },
  {
    path: "/payroll",
    name: "Payroll",
    element: <PayrollPage />,
  },
  {
    path: "/appraisal",
    name: "Appraisal",
    element: <AppraisalPage />,
  },
  {
    path: "/attendance",
    name: "Attendance",
    element: <AttendancePage />,
  },

  //Asset management
  {
    path: "/asset_list/add",
    name: "Asset add",
    element: <Asset />,
  },
  {
    path: "/asset_list/view",
    name: "Asset view",
    element: <AssetView />,
  },
  {
    path: "/asset_list",
    name: "Asset list",
    element: <AssetList />,
  },
  {
    path: "/asset_list/edit",
    name: "Asset edit",
    element: <AssetEdit />,
  },

  //Inventory
  {
    path: "/inventory_list/add",
    name: "Inventory add",
    element: <Inventory />,
  },
  {
    path: "/inventory_list",
    name: "Inventory list",
    element: <InventoryList />,
  },
  {
    path: "/inventory_list/view",
    name: "Inventory view",
    element: <InventoryView />,
  },
  {
    path: "/inventory_list/edit",
    name: "Inventory edit",
    element: <InventoryEdit />,
  },
  //Asset type
  {
    path: "/asset_type/add",
    name: "Asset type add",
    element: <AssetType />,
  },
  {
    path: "/asset_type/view",
    name: "Asset type view",
    element: <AssetTypeView />,
  },
  {
    path: "/asset_type/edit",
    name: "Asset type edit",
    element: <AssetTypeEdit />,
  },
  {
    path: "/asset_type",
    name: "Asset type list",
    element: <AssetListType />,
  },

  //complaints
  {
    path: "/complaints/add",
    name: "complaint",
    element: <ComplaintsAdd />,
  },
  {
    path: "/complaints",
    name: "complaint list",
    element: <MyComplaints />,
  },
  {
    path: "/complaints/edit",
    name: "complaint edit",
    element: <ComplaintsEdit />,
  },
  {
    path: "/complaints/view",
    name: "complaint view",
    element: <ComplaintsView />,
  },

  //My complaints
  {
    path: "/complaints/team_complaints",
    name: "Asset",
    element: <ComplaintsList />,
  },

  // my profile
  {
    path: "/my_profile/view",
    name: "Profile view",
    element: <MyProfile />,
  },
  {
    path: "/my_profile/edit",
    name: "Profile edit",
    element: <MyProfileEdit />,
  },
  {
    path: "/my_profile",
    name: "Profile edit",
    element: <MyProfile />,
  },

  //My asset
  {
    path: "/my_assets",
    name: "Asset",
    element: <MyAsset />,
  },

  //Requirement Raising
  {
    path: "/raise_requirement",
    name: "Requirement Raising",
    element: <RequirementRaising />,
  },
  {
    path: "/open_requirements",
    name: "Open Requirements",
    element: <OpenRequirements />,
  },
  {
    path: "/closed_requirements/edit",
    name: "Open Requirements",
    element: <EditClosedRequirement />,
  },
  {
    path: "/open_requirements/edit",
    name: "Open Requirements",
    element: <EditOpenRequirement />,
  },
  {
    path: "/closed_requirements/view",
    name: "Open Requirements",
    element: <ViewClosedRequirement />,
  },
  {
    path: "/open_requirements/view",
    name: "Open Requirements",
    element: <ViewOpenRequirement />,
  },
  {
    path: "/closed_requirements",
    name: "Closed Requirements",
    element: <ClosedRequirements />,
  },

  //Recruitment Process

  {
    path: "/job_application",
    name: "Job Application",
    element: <JobApplication />,
  },
  {
    path: "/applied_candidates",
    name: "Applied Candidates",
    element: <AppliedCandidates />,
  },
  {
    path: "/applied_candidates/view",
    name: "Applied Candidates",
    element: <ViewAppliedCandidates />,
  },
  {
    path: "/applied_candidates/edit",
    name: "Applied Candidates",
    element: <EditAppliedCandidates />,
  },
  {
    path: "/interview_scheduled_candidates",
    name: "Interview Scheduled Candidates",
    element: <InterviewScheduledCandidates />,
  },
  {
    path: "/selected_candidates",
    name: "Selected Candidates",
    element: <SelectedCandidates />,
  },
  {
    path: "/offered_candidates",
    name: "Offered Candidates",
    element: <OfferedCandidates />,
  },
  {
    path: "/accepted_offers",
    name: "Accepted Offers",
    //
  },
  {
    path: "/rejected_candidates",
    name: "Rejected Candidates",
    element: <RejectedCandidates />,
  },
  {
    path: "/declined_candidates",
    name: "Declined Candidates",
    element: <DeclinedCandidates />,
  },
  {
    path: "/your_offer",
    name: "Your Offer",
    element: <YourOffer />,
  },

  //Settings

  {
    path: "/department/add",
    name: "department",
    element: <Department />,
  },
  {
    path: "/department/view",
    name: "department",
    element: <DepartmentView />,
  },
  {
    path: "/department/edit",
    name: "department",
    element: <DepartmentEdit />,
  },
  {
    path: "/department",
    name: "department",
    element: <DepartmentList />,
  },
  {
    path: "/designation/add",
    name: "designation",
    element: <Designation />,
  },
  {
    path: "/designation/view",
    name: "designation",
    element: <DesignationView />,
  },
  {
    path: "/designation/edit",
    name: "designation",
    element: <DesignationEdit />,
  },
  {
    path: "/designation",
    name: "designation",
    element: <DesignationList />,
  },
  {
    path: "/leave_type/add",
    name: "Add Leave Type",
    element: <LeaveTrackerPage />,
  },
  {
    path: "/leave_type",
    name: "Add Leave Type",
    element: <LeaveTypeList />,
  },
  {
    path: "/leave_type/view",
    name: "Add Leave Type",
    element: <LeaveTypeView />,
  },
  {
    path: "/leave_type/edit",
    name: "Leave Types",
    element: <LeaveTypeEdit />,
  },

  //Leave Tracker

  {
    path: "/apply_leave",
    name: "Apply leave",
    element: <ApplyLeave />,
  },
  {
    path: "/requested_leave",
    name: "Requested leave",
    element: <RequestedLeave />,
  },
  {
    path: "/approved_leave",
    name: "Approved leave",
    element: <ApprovedLeave />,
  },
  {
    path: "/rejected_leave",
    name: "Rejected leave",
    element: <RejectedLeave />,
  },

  {
    path: "/team_leaves",
    name: "Team leave",
    element: <TeamLeaves />,
  },
  {
    path: "/leave_requests",
    name: "Team leave",
    element: <LeaveRequests />,
  },

  {
    path: "/rejected_leaves",
    name: "Team leave",
    element: <ManagerRejectedLeaves />,
  },

  //Attendance
  {
    path: "/attendance",
    name: "Attendance",
    element: <AttendancePage />,
  },

  //Task Tracker
  {
    path: "/list_task/add",
    name: "Add Task",
    element: <TaskTracker />,
  },
  {
    path: "/list_task",
    name: "List Task",
    element: <TaskTrackerList />,
  },
  {
    path: "/team_attendance",
    name: "List Task",
    element: <TeamAttendanceList />,
  },
];

export default routes;
