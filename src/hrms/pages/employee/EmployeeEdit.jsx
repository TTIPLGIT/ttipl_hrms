import { useLocation, useNavigate } from "react-router-dom";
import CustomFormWrapper from "../../../components/form/customForm/CustomFormWrapper";
// import { unProtectedCall } from "../../services/organizationService";
import { protectedCall, unProtectedCall } from "../../../services/userService";

import { useEffect, useMemo, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import InfinityLoader from "../../../components/loader/Infinity";
import { format } from "date-fns";
import { useForm } from "react-hook-form";

export default function EmployeeEdit() {
  const [loader, setLoader] = useState(false);
  const methods = useForm();

  const [orgName, setOrgName] = useState();
  const [extractedData1, setExtractedData] = useState();
  const [isReportingManager, setIsReportingManager] = useState([]);
  const [role, setRole1] = useState([]);
  const [roleNameDropDown, setRoleNameDropDown] = useState([]);
  const [department, setDepartment] = useState([]);
  const [designation, setDesignation] = useState([]);

  const toastRef = useRef(null);

  // //to fetch organization details
  // useEffect(() => {
  //   const fetchOrgData = async () => {
  //     setLoader(true); // Start loader

  //     try {
  //       const orgData = await protectedCall("api/organization");
  //       const extractedData = orgData.map((org) => ({
  //         id: org.id,
  //         organizationName: org.organizationName,
  //       }));
  //       setExtractedData(extractedData);
  //       setOrgName(extractedData.map((i) => i.organizationName));
  //     } catch (error) {
  //       // console.log("orgData", error);
  //     } finally {
  //       setLoader(false); // Stop loader
  //     }
  //   };
  //   fetchOrgData();
  // }, []);
  // // to fetch employee details
  // useEffect(() => {
  //   const fetchEmployeeData = async () => {
  //     setLoader(true); // Start loader

  //     try {
  //       const employeeData = await protectedCall("api/employee");
  //       const employeeIsManager = employeeData
  //         .filter((employee) => employee.isReportingManager === true)
  //         .map((employee) => employee.officialEmail);
  //       setIsReportingManager(employeeIsManager);
  //     } catch (error) {
  //       // console.log(error);
  //     } finally {
  //       setLoader(false); // Stop loader
  //     }
  //   };
  //   fetchEmployeeData();
  // }, []);
  // //to fetch roles
  // useEffect(() => {
  //   const fetchRoleData = async () => {
  //     setLoader(true); // Start loader

  //     try {
  //       const roleData = await protectedCall("api/roles");
  //       const roleDataForDropdown = roleData.map((role) => ({
  //         id: role.id,
  //         name: role.name,
  //       }));
  //       setRole1(roleDataForDropdown);
  //     } catch (error) {
  //       // console.log(error);
  //     } finally {
  //       setLoader(false); // Stop loader
  //     }
  //   };
  //   fetchRoleData();
  // }, []);
  // // Update roleNameDropDown when roles are fetched
  // useEffect(() => {
  //   setLoader(true); // Start loader

  //   const news = role.map((i) => i.name);
  //   setRoleNameDropDown(news.map((i) => i));

  //   setLoader(false); // Stop loader
  // }, [role]);
  useEffect(() => {
    const fetchData = async () => {
      setLoader(true); // Start loader for all fetch operations

      try {
        // Fetch organization data
        const orgData = await protectedCall("api/organization");
        const extractedOrgData = orgData.map((org) => ({
          id: org.id,
          organizationName: org.organizationName,
        }));
        setExtractedData(extractedOrgData);
        setOrgName(extractedOrgData.map((i) => i.organizationName));

        // Fetch employee data
        const employeeData = await protectedCall("api/employee");
        const employeeIsManager = employeeData
          .filter((employee) => employee.isReportingManager === true)
          .map((employee) => employee.officialEmail);
        setIsReportingManager(employeeIsManager);

        // Fetch roles data
        const roleData = await protectedCall("api/roles");
        const roleDataForDropdown = roleData.map((role) => ({
          id: role.id,
          name: role.name,
        }));
        setRole1(roleDataForDropdown);

        // Prepare role name dropdown
        setRoleNameDropDown(roleDataForDropdown.map((i) => i.name));
        // Fetch department data
        const departmentData = await protectedCall(
          "api/requirement/department"
        );
        const extractedDepartment = departmentData.map((i) => i.department);
        setDepartment(extractedDepartment);

        // Fetch designation data
        const designationData = await protectedCall(
          "api/requirement/designation"
        );
        const extractedDesignation = designationData.map((i) => i.designation);
        setDesignation(extractedDesignation);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoader(false); // Stop loader after all fetches complete
      }
    };

    fetchData();
  }, []);

  const ageValidation = (value) => {
    if (!value) return "Date of Birth is required"; // If no date is provided

    const selectedDate = new Date(value);
    const today = new Date();
    let age = today.getFullYear() - selectedDate.getFullYear(); // Use 'let' here to allow reassignment
    const month = today.getMonth() - selectedDate.getMonth();

    if (
      month < 0 ||
      (month === 0 && today.getDate() < selectedDate.getDate())
    ) {
      age--; // Adjust age if birthday hasn't occurred this year
    }

    if (age < 18) {
      return "You must be 18 years or older"; // Error message if age < 18
    }

    return true; // Valid if age is 18 or older
  };

  const formDT = useMemo(
    () => [
      {
        labelText: "First Name",
        name: "firstName",
        id: "firstName",
        placeholder: "Enter First Name",
        type: "text",
        defaultValue: "",
        disabled: "",
        //: "Enter First Name",
      },
      {
        labelText: "Last Name",
        name: "lastName",
        id: "lastName",
        placeholder: "Enter Last Name",
        type: "text",
        defaultValue: "",
        disabled: "",
        //: "Enter Last Name",
      },
      {
        labelText: "Personal Email",
        name: "personalEmail",
        id: "personalEmail",
        placeholder: "Enter Personal Email",
        type: "text",
        defaultValue: "",
        disabled: "",
        //: "Enter Personal Email",
      },
      {
        labelText: "Mobile Number",
        name: "mobileNumber",
        id: "mobileNumber",
        placeholder: "Enter Mobile Number",
        type: "phone",
        defaultValue: "",
        disabled: "",
        //: "Enter Mobile Number",
      },
      {
        labelText: "Gender",
        name: "gender",
        id: "gender",
        placeholder: "Select Gender",
        type: "radio",
        options: ["Male", "Female"],
        defaultValue: "",
        disabled: "",
        //: "Select Gender",
      },
      {
        labelText: "Photo",
        name: "photo",
        id: "photo",
        placeholder: "Upload Photo",
        type: "text",
        defaultValue: "",
        disabled: "",
        //: "Upload Photo",
      },
      {
        labelText: "Employee ID",
        name: "employeeId",
        id: "employeeId",
        placeholder: "Enter Employee ID",
        type: "text",
        defaultValue: "",
        disabled: "",
        //: "Enter Employee ID",
      },
      {
        labelText: "Official Email",
        name: "officialEmail",
        id: "officialEmail",
        placeholder: "Enter Official Email",
        type: "text",
        defaultValue: "",
        disabled: "",
        //: "Enter Official Email",
      },
      {
        labelText: "State",
        name: "location",
        id: "location",
        placeholder: "Select Location",
        type: "select",
        options: [
          "Andhra Pradesh",
          "Arunachal Pradesh",
          "Assam",
          "Bihar",
          "Chhattisgarh",
          "Goa",
          "Gujarat",
          "Haryana",
          "Himachal Pradesh",
          "Jharkhand",
          "Karnataka",
          "Kerala",
          "Madhya Pradesh",
          "Maharashtra",
          "Manipur",
          "Meghalaya",
          "Mizoram",
          "Nagaland",
          "Odisha",
          "Punjab",
          "Rajasthan",
          "Sikkim",
          "Tamil Nadu",
          "Telangana",
          "Tripura",
          "Uttar Pradesh",
          "Uttarakhand",
          "West Bengal",
        ],
        defaultValue: "",
        disabled: "",
        //: "Select Location",
      },
      {
        labelText: "Department",
        name: "department",
        id: "department",
        placeholder: "Select Department",
        type: "select",
        options: department,
        defaultValue: "",
        disabled: "",
        //: "Select Department",
      },
      {
        labelText: "Designation",
        name: "designation",
        id: "designation",
        placeholder: "Select Designation",
        options: designation,
        type: "select",
        defaultValue: "",
        disabled: "",
      },
      {
        labelText: "Reporting To",
        name: "reportingTo",
        id: "reportingTo",
        placeholder: "Enter Reporting Manager",
        type: "select",
        options: isReportingManager,
        disabled: "",
      },
      {
        labelText: "Date of Birth",
        name: "dateOfBirth",
        id: "dateOfBirth",
        placeholder: "Enter Date of Birth",
        type: "date",
        defaultValue: "",
        disabled: "",
        validate: { ageValidation },
        //: "Enter Date of Birth",
      },
      {
        labelText: "Date of Joining",
        name: "dateOfJoining",
        id: "dateOfJoining",
        placeholder: "Enter Date of Joining",
        type: "date",
        defaultValue: "",
        disabled: "",
        //: "Enter Date of Joining",
      },
      {
        labelText: "Work Experience",
        name: "workExperience",
        id: "workExperience",
        placeholder: "Select Experience",
        type: "radio",
        options: ["Fresher", "Experienced"],
        defaultValue: "",
        disabled: "",
        //: "Select Experience",
      },
      {
        labelText: "Marital Status",
        name: "maritalStatus",
        id: "maritalStatus",
        placeholder: "Select Marital Status",
        type: "select",
        options: ["Single", "Married"],
        defaultValue: "",
        disabled: "",
        //: "Select Marital Status",
      },
      {
        labelText: "Blood Group",
        name: "bloodGroup",
        id: "bloodGroup",
        placeholder: "Enter Blood Group",
        type: "text",
        defaultValue: "",
        disabled: "",
        //: "Enter Blood Group",
      },
      {
        labelText: "Emergency Contact Person",
        name: "emergencyContactPerson",
        id: "emergencyContactPerson",
        placeholder: "Enter Emergency Contact Person",
        type: "text",
        defaultValue: "",
        disabled: "",
        //: "Enter Emergency Contact Person",
      },
      {
        labelText: "Relationship",
        name: "relationship",
        id: "relationship",
        placeholder: "Enter Relationship",
        type: "text",
        defaultValue: "",
        disabled: "",
        //: "Enter Relationship",
      },
      {
        labelText: "Contact Number",
        name: "contactNumber",
        id: "contactNumber",
        placeholder: "Enter Contact Number",
        type: "phone",
        defaultValue: "",
        disabled: "",
        //: "Enter Contact Number",
      },
      {
        labelText: "Present Address",
        name: "presentAddress",
        id: "presentAddress",
        placeholder: "Enter Present Address",
        type: "text",
        defaultValue: "",
        disabled: "",
        //: "Enter Present Address",
      },
      {
        labelText: "Permanent Address",
        name: "permanentAddress",
        id: "permanentAddress",
        placeholder: "Enter Permanent Address",
        type: "text",
        defaultValue: "",
        disabled: "",
        //: "Enter Permanent Address",
      },
      {
        labelText: "Father's Name",
        name: "fatherName",
        id: "fatherName",
        placeholder: "Enter Father's Name",
        type: "text",
        defaultValue: "",
        disabled: "",
        //: "Enter Father's Name",
      },
      {
        labelText: "Mother's Name",
        name: "motherName",
        id: "motherName",
        placeholder: "Enter Mother's Name",
        type: "text",
        defaultValue: "",
        disabled: "",
        //: "Enter Mother's Name",
      },
      {
        labelText: "Employee Status",
        name: "employeeStatus",
        id: "employeeStatus",
        placeholder: "Select Employee Status",
        type: "select",
        options: ["Active", "Inactive"],
        defaultValue: "",
        disabled: "",
        //: "Select Employee Status",
      },
      {
        labelText: "Employee Type",
        name: "employeeType",
        id: "employeeType",
        placeholder: "Select Employee Type",
        type: "select",
        options: roleNameDropDown,
        defaultValue: "",
        disabled: "",
        //: "Select Employee Type",
      },
      {
        labelText: "Employee Level",
        name: "employeeLevel",
        id: "employeeLevel",
        placeholder: "Enter Employee Level",
        type: "text",
        defaultValue: "",
        disabled: "",
        //: "Enter Employee Level",
      },
      {
        labelText: "Organization Name",
        name: "organizationId",
        id: "organizationId",
        placeholder: "Enter Organization ID",
        options: orgName,
        type: "select",
        defaultValue: [],
        disabled: "",
      },
      {
        labelText: " ",
        name: "isReportingManager",
        id: "isReportingManager",
        type: "checkbox",
        options: ["Is a reporting manager"],
        disabled: "",
      },
    ],
    [roleNameDropDown, orgName, isReportingManager, department, designation]
  );

  const navigate = useNavigate();
  const { state } = useLocation();
  const [newFormData, setFormData] = useState();
  const [orgNameFromApi, setOrgNameFromApi] = useState();

  useEffect(() => {
    const fetchData = async () => {
      setLoader(true);

      try {
        // Fetch employee data
        const data = await protectedCall(`api/employee/${state?.id}`);

        const orgId = data.organizationId;
        console.log("data", data);

        // Fetch organization data
        if (orgId) {
          const organizationData = await protectedCall(
            `api/organization/${orgId}`
          );
          setOrgNameFromApi(organizationData.organizationName);
        }

        // Only map form data if the required dependencies are present
        if (
          roleNameDropDown?.length &&
          orgNameFromApi?.length &&
          department?.length &&
          designation?.length
          // isReportingManager?.length
        ) {
          const formData = formDT?.map((elem) => {
            if (elem.id === "dateOfBirth") {
              return {
                ...elem,
                defaultValue: format(new Date(data.dateOfBirth), "dd-MM-yyyy"),
              };
            }
            if (elem.id === "dateOfJoining") {
              return {
                ...elem,
                defaultValue: format(
                  new Date(data.dateOfJoining),
                  "dd-MM-yyyy"
                ),
              };
            }
            if (elem?.id === "organizationId") {
              return {
                ...elem,
                defaultValue: orgNameFromApi, // Set the orgNameFromApi as default value
              };
            }
            if (elem?.id === "isReportingManager" && data.isReportingManager) {
              return {
                ...elem,
                defaultValue: "Is a reporting manager",
              };
            }

            return { ...elem, defaultValue: data[elem?.id] };
          });

          setFormData(formData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoader(false);
      }
    };

    fetchData();
  }, [
    state?.id,
    formDT,
    roleNameDropDown?.length,
    orgName?.length,
    isReportingManager?.length,
    orgNameFromApi,
  ]);

  const handleSubmit = async (e) => {
    const selectedOrdName = e.organizationId;
    const selectedOrg = extractedData1.find(
      (org) => org.organizationName === selectedOrdName
    );

    const selectedRoleName = e.employeeType;
    const selectedRole = role.find((r) => r.name === selectedRoleName);

    if (selectedRole) {
      e.roleId = selectedRole.id;
    }
    if (selectedOrg) {
      e.organizationId = selectedOrg.id;
    }

    if (e.isReportingManager === "Is a reporting manager") {
      e.isReportingManager = true;
    }

    // Add employee ID to the request payload
    const dataWithId = {
      id: String(state?.id),
      ...e,
    };
    setLoader(true);
    try {
      const response = await protectedCall(
        `api/employee/update`,
        dataWithId,
        "post"
      );
      toastRef.current.show({
        severity: "success",
        summary: "Success",
        detail: "Employee update successfully",
        life: 3000, // Duration in ms
      });

      // Delay the redirection by 2 seconds
      setTimeout(() => {
        navigate("/employee_list");
      }, 2000); // 2000ms = 2 seconds
      // Redirect to employee list after submission
    } catch (error) {
      toastRef.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to update employee.",
        life: 3000, // Duration in ms
      });
    } finally {
      setLoader(false);
    }
  };

  const handleBack = async (e) => {
    e.preventDefault();
    navigate("/employee_list");
  };
  const handleCancel = async (e) => {
    e.preventDefault();
    methods.reset();
  };

  return (
    <>
      <Toast ref={toastRef} />
      {loader ? (
        <InfinityLoader />
      ) : (
        <CustomFormWrapper
          formName="Edit Employee"
          formDT={newFormData}
          submitAction={handleSubmit}
          extraButtons={[
            {
              BorASubmit: "b",
              name: "Back",
              icon: {
                iconName: "fa fa-arrow-left",
                BorAname: "b",
              },
              btnAction: (e) => {
                handleBack(e);
              },
              className: "bg-red-600 hover:bg-red-700 flex align-items-center",
              style: { background: "red" },
            },
            {
              BorASubmit: "a",
              name: "Reset",
              icon: { iconName: "pi pi-times", BorAname: "b" },
              btnAction: (e) => {
                handleCancel(e);
              },
              className: "bg-red-600 hover:bg-red-700 flex align-items-center",
              style: { background: "red" },
            },
          ]}
          methods={methods}
        />
      )}
    </>
  );
}
