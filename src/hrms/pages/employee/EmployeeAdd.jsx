import { useNavigate } from "react-router-dom";
import CustomForm from "../../../components/form/customForm/CustomForm";
import { protectedCall } from "../../../services/userService";
import { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import InfinityLoader from "../../../components/loader/Infinity";
import { useForm } from "react-hook-form";

const formStyles = {
  noOfFledsInARow: {
    sm: 12,
    md: 12,
    lg: 12,
    xl: 4,
  },
  inputFields: {
    text: "",
    bgColor: "",
    border: "",
    padding: "",
    fontWeight: "",
    fontSize: "",
  },
  labelStyle: {
    text: "",
    padding: "",
    fontWeight: "500",
    fontSize: "16px",
  },
};

export default function EmployeeAdd() {
  const [loader, setLoader] = useState(false);

  const [orgName, setOrgName] = useState();
  const [extractedData1, setExtractedData] = useState();
  const [isReportingManager, setIsReportingManager] = useState([]);
  const [base64Img, setBase64Img] = useState("");
  const [role, setRole1] = useState([]);
  const [roleNameDropDown, setRoleNameDropDown] = useState([]);
  const toastRef = useRef(null);
  const [department, setDepartment] = useState([]);
  const [designation, setDesignation] = useState([]);
  // //to fetch organization details
  // useEffect(() => {
  //   const fetchOrgData = async () => {
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
  //     }
  //   };
  //   fetchOrgData();
  // }, []);
  // // to fetch employee details
  // useEffect(() => {
  //   const fetchEmployeeData = async () => {
  //     try {
  //       const employeeData = await protectedCall("api/employee");
  //       const employeeIsManager = employeeData
  //         .filter((employee) => employee.isReportingManager === true)
  //         .map((employee) => employee.officialEmail);
  //       setIsReportingManager(employeeIsManager);
  //     } catch (error) {
  //       // console.log(error);
  //     }
  //   };
  //   fetchEmployeeData();
  // }, []);
  // //to fetch roles
  // useEffect(() => {
  //   const fetchRoleData = async () => {
  //     try {
  //       const roleData = await protectedCall("api/roles");
  //       const roleDataForDropdown = roleData.map((role) => ({
  //         id: role.id,
  //         name: role.name,
  //       }));
  //       setRole1(roleDataForDropdown);
  //     } catch (error) {
  //       // console.log(error);
  //     }
  //   };
  //   fetchRoleData();
  // }, []);
  // // Update roleNameDropDown when roles are fetched
  // useEffect(() => {
  //   setRoleNameDropDown(role.map((i) => i.name));
  // }, [role]); // Only run when 'role' changes

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch organization data
        const orgData = await protectedCall("api/organization");
        const extractedData = orgData.map((org) => ({
          id: org.id,
          organizationName: org.organizationName,
        }));
        setExtractedData(extractedData);
        setOrgName(extractedData.map((i) => i.organizationName));

        // Fetch employee data
        const employeeData = await protectedCall("api/employee");
        const employeeIsManager = employeeData
          .filter((employee) => employee.isReportingManager === true)
          .map((employee) => employee.officialEmail);
        setIsReportingManager(employeeIsManager);

        // Fetch role data
        const roleData = await protectedCall("api/roles");
        const roleDataForDropdown = roleData.map((role) => ({
          id: role.id,
          name: role.name,
        }));
        setRole1(roleDataForDropdown);

        // Update roleNameDropDown based on roles
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
        console.log(error);
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
  const validation80kb = (files) => {
    if (!files || !files.length) return "No file selected.";
    if (files[0].size > 80 * 1024) return "File size must be less than 80kb.";
    return true;
  };

  const validate10Digits = (value) => {
    console.log(value, "value");

    if (!value) return "No number entered.";
    const numberPattern = /^\d{12}$/;
    return numberPattern.test(value)
      ? true
      : "Number must be exactly 10 digits.";
  };

  const formDT = [
    {
      labelText: (
        <span>
          First Name <span className="text-red-600">*</span>
        </span>
      ),
      name: "firstName",
      id: "firstName",
      placeholder: "Enter First Name",
      type: "text",
      defaultValue: "",
      disabled: "",
      required: "Enter First Name",
    },
    {
      labelText: (
        <span>
          Last Name <span className="text-red-600">*</span>
        </span>
      ),
      name: "lastName",
      id: "lastName",
      placeholder: "Enter Last Name",
      type: "text",
      defaultValue: "",
      disabled: "",
      required: "Enter Last Name",
    },
    {
      labelText: (
        <span>
          Personal Email <span className="text-red-600">*</span>
        </span>
      ),
      name: "personalEmail",
      id: "personalEmail",
      placeholder: "Enter Personal Email",
      type: "text",
      defaultValue: "",
      disabled: "",
      required: "Enter Personal Email",
    },
    {
      labelText: (
        <span>
          Mobile Number <span className="text-red-600">*</span>
        </span>
      ),
      name: "mobileNumber",
      id: "mobileNumber",
      placeholder: "Enter Mobile Number",
      type: "phone",
      defaultValue: "",
      disabled: "",
      required: "Enter Mobile Number",
      validation: { validate10Digits },
    },
    {
      labelText: (
        <span>
          Gender <span className="text-red-600">*</span>
        </span>
      ),
      name: "gender",
      id: "gender",
      placeholder: "Select Gender",
      type: "radio",
      options: ["Male", "Female"],
      defaultValue: "",
      disabled: "",
      required: "Select Gender",
    },
    {
      labelText: (
        <span>
          Photo <span className="text-red-600">*</span>
        </span>
      ),
      name: "photo",
      id: "photo",
      placeholder: "Upload Photo",
      type: "file",
      defaultValue: "",
      accept: ".jpg,.jpeg,.png",
      disabled: "",
      required: "Upload Photo",
      validation: { validation80kb },
      tagNeeded: (
        // Please upload a photo in JPEG or PNG format with a maximum file size of 80KB.
        <p className="text-gray-500 text-xs  font-semibold my-0">
          Maximum file size of 80KB.
        </p>
      ),
    },
    {
      labelText: (
        <span>
          Employee ID <span className="text-red-600">*</span>
        </span>
      ),
      name: "employeeId",
      id: "employeeId",
      placeholder: "Enter Employee ID",
      type: "text",
      disabled: "",
      required: "Enter Employee ID",
    },
    {
      labelText: (
        <span>
          Employee Type<span className="text-red-600">*</span>
        </span>
      ),
      name: "employeeType",
      id: "employeeType",
      placeholder: "Select Employee Type",
      type: "select",
      options: roleNameDropDown,
      disabled: "",
      required: "Select Employee Type",
    },
    {
      labelText: (
        <span>
          Employee Level <span className="text-red-600">*</span>
        </span>
      ),
      name: "employeeLevel",
      id: "employeeLevel",
      placeholder: "Select Employee Level",
      type: "select", // Input type set to select
      options: ["L1", "L2", "L3", "L4", "L5", "Manager", "Director", "VP"], // Common employee levels
      defaultValue: "", // Set an empty default value to prompt selection
      disabled: "",
      required: "Select Employee Level",
    },
    {
      labelText: (
        <span>
          Organization Name <span className="text-red-600">*</span>
        </span>
      ),

      name: "organizationId",
      id: "organizationId",
      placeholder: "Select Organization Name",
      options: orgName,
      type: "select",
      defaultValue: "",
      disabled: "",
      required: "Select Organization Name",
    },
    {
      labelText: (
        <span>
          Official Email <span className="text-red-600">*</span>
        </span>
      ),
      name: "officialEmail",
      id: "officialEmail",
      placeholder: "Enter Official Email",
      type: "text",
      disabled: "",
      required: "Enter Official Email",
    },
    {
      labelText: (
        <span>
          State <span className="text-red-600">*</span>
        </span>
      ),
      name: "location",
      id: "location",
      placeholder: "Select State",
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
      disabled: "",
      required: "Select Location",
    },
    {
      labelText: (
        <span>
          Department <span className="text-red-600">*</span>
        </span>
      ),
      name: "department",
      id: "department",
      placeholder: "Select Department",
      type: "select",
      options: department,
      disabled: "",
      required: "Select Department",
    },
    {
      labelText: (
        <span>
          Designation <span className="text-red-600">*</span>
        </span>
      ),
      name: "designation",
      id: "designation",
      placeholder: "Select Designation",
      type: "select", // Input type set to select
      options: designation,
      disabled: "",
      required: "Select Designation",
    },
    {
      labelText: (
        <span>
          Reporting To <span className="text-red-600">*</span>
        </span>
      ),
      name: "reportingTo",
      id: "reportingTo",
      placeholder: "Enter Reporting Manager",
      type: "select",
      options: isReportingManager,
      disabled: "",
    },

    {
      labelText: (
        <span>
          Date of Birth <span className="text-red-600">*</span>
        </span>
      ),
      name: "dateOfBirth",
      id: "dateOfBirth",
      placeholder: "Enter Date of Birth",
      type: "date",
      disabled: "",
      required: "Enter Date of Birth",
      validation: { ageValidation },
    },
    {
      labelText: (
        <span>
          Date of Joining <span className="text-red-600">*</span>
        </span>
      ),
      name: "dateOfJoining",
      id: "dateOfJoining",
      placeholder: "Enter Date of Joining",
      type: "date",
      disabled: "",
      required: "Enter Date of Joining",
    },

    {
      labelText: " ",
      name: "isReportingManager",
      id: "isReportingManager",
      type: "checkbox",
      options: ["Is a reporting manager"],
      disabled: "",
    },
    {
      labelText: (
        <span>
          Work Experience <span className="text-red-600">*</span>
        </span>
      ),
      name: "workExperience",
      id: "workExperience",
      placeholder: "Select Experience",
      type: "radio",
      options: ["Fresher", "Experienced"],
      disabled: "",
      required: "Select Experience",
    },
    {
      labelText: (
        <span>
          Marital Status <span className="text-red-600">*</span>
        </span>
      ),
      name: "maritalStatus",
      id: "maritalStatus",
      placeholder: "Select Marital Status",
      type: "select",
      options: ["Single", "Married"],
      disabled: "",
      required: "Select Marital Status",
    },
    {
      labelText: (
        <span>
          Blood Group <span className="text-red-600">*</span>
        </span>
      ),
      name: "bloodGroup",
      id: "bloodGroup",
      placeholder: "Select Blood Group",
      type: "select", // Changed to select
      options: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], // All blood groups
      disabled: "",
      required: "Enter Blood Group",
    },
    {
      labelText: (
        <span>
          Emergency Contact Person <span className="text-red-600">*</span>
        </span>
      ),
      name: "emergencyContactPerson",
      id: "emergencyContactPerson",
      placeholder: "Enter Emergency Contact Person",
      type: "text",
      disabled: "",
      required: "Enter Emergency Contact Person",
      validation: { validate10Digits },
    },
    {
      labelText: (
        <span>
          Relationship <span className="text-red-600">*</span>
        </span>
      ),
      name: "relationship",
      id: "relationship",
      placeholder: "Select Relationship",
      type: "select", // Changed to select
      options: [
        "Father",
        "Mother",
        "Brother",
        "Sister",
        "Spouse",
        "Son",
        "Daughter",
        "Guardian",
        "Friend",
      ], // Common relationships
      disabled: "",
      required: "Enter Relationship",
    },
    {
      labelText: (
        <span>
          Contact Number <span className="text-red-600">*</span>
        </span>
      ),
      name: "contactNumber",
      id: "contactNumber",
      placeholder: "Enter Contact Number",
      type: "phone",
      disabled: "",
      required: "Enter Contact Number",
    },
    {
      labelText: (
        <span>
          Present Address <span className="text-red-600">*</span>
        </span>
      ),
      name: "presentAddress",
      id: "presentAddress",
      placeholder: "Enter Present Address",
      type: "text",
      disabled: "",
      required: "Enter Present Address",
    },
    {
      labelText: (
        <span>
          Permanent Address <span className="text-red-600">*</span>
        </span>
      ),
      name: "permanentAddress",
      id: "permanentAddress",
      placeholder: "Enter Permanent Address",
      type: "text",
      disabled: "",
      required: "Enter Permanent Address",
    },
    {
      labelText: (
        <span>
          Father's Name <span className="text-red-600">*</span>
        </span>
      ),
      name: "fatherName",
      id: "fatherName",
      placeholder: "Enter Father's Name",
      type: "text",
      disabled: "",
      required: "Enter Father's Name",
    },
    {
      labelText: (
        <span>
          Mother's Name <span className="text-red-600">*</span>
        </span>
      ),
      name: "motherName",
      id: "motherName",
      placeholder: "Enter Mother's Name",
      type: "text",
      disabled: "",
      required: "Enter Mother's Name",
    },
    {
      labelText: (
        <span>
          Employee Status <span className="text-red-600">*</span>
        </span>
      ),
      name: "employeeStatus",
      id: "employeeStatus",
      placeholder: "Select Employee Status",
      type: "select",
      options: ["Active", "Inactive"],
      defaultValue: "Active",
      disabled: "",
      required: "Select Employee Status",
      routeWithQuery: "/api/roles",
    },
  ];

  const methods = useForm();

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    setLoader(true);
    const selectedOrdName = e.organizationId;
    const selectedOrg = extractedData1?.find(
      (org) => org.organizationName === selectedOrdName
    );
    const selectedRoleName = e.employeeType; // Assuming employeeType corresponds to the selected role
    const selectedRole = role?.find((r) => r.name === selectedRoleName);
    if (selectedRole) {
      e.roleId = selectedRole.id; // Add roleId to the employee object
    } else {
      return; // Exit if role is not found
    }
    if (selectedOrg) {
      e.organizationId = selectedOrg.id; // Set the organizationId to the corresponding id
    } else {
      return; // Exit if organization is not found
    }
    if (e.isReportingManager === "Is a reporting manager") {
      e.isReportingManager = true;
      setIsReportingManager(true);
    }
    const profileImage = e.photo; // This should be the file input
    if (profileImage && profileImage.length > 0) {
      const render = new FileReader();
      render.onloadend = async () => {
        setBase64Img(render.result); // Set base64 image
        e.photo = render.result;

        //Make your API call here
        try {
          const response = await protectedCall(
            "api/employee/create",
            e,
            "post"
          );

          toastRef.current.show({
            severity: "success",
            summary: "Success",
            detail: "Employee added successfully",
            life: 3000, // Duration in ms
          });

          // Delay the redirection by 2 seconds
          setTimeout(() => {
            navigate("/employee_list");
          }, 2000); // 2000ms = 2 seconds
        } catch (error) {
          // Show error toast
          toastRef.current.show({
            severity: "error",
            summary: "Error",
            detail: error.response.data.message,
            life: 3000, // Duration in ms
          });
        } finally {
          setLoader(false);
        }
      };

      render.readAsDataURL(profileImage[0]); // Use profileImage[0] to get the file from the FileList
    } else {
      setLoader(false);
    }
  };
  const handleCancel = async (e) => {
    e.preventDefault();
    methods.reset();
  };
  const handleBack = async (e) => {
    e.preventDefault();
    navigate("/employee_list");
  };

  return (
    <>
      {/* ToastContainer */}
      <Toast ref={toastRef} />
      {loader ? (
        <InfinityLoader />
      ) : (
        <div
          style={{
            height: "80vh",
            overflow: "scroll",
            display: "grid",
            gridTemplateColumns: "100%",
            backgroundColor: "white",
            padding: "2rem",
          }}
        >
          <div style={{}}>
            {" "}
            <CustomForm
              formDT={formDT}
              formStyles={formStyles}
              submitAction={handleSubmit}
              formWrapperStyle={{ justifyContent: "start" }}
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
                  className:
                    "bg-red-600 hover:bg-red-700 flex align-items-center",
                  style: { background: "red" },
                },
                {
                  BorASubmit: "a",
                  name: "Reset",
                  icon: { iconName: "pi pi-times", BorAname: "b" },
                  btnAction: (e) => {
                    handleCancel(e);
                  },
                  className:
                    "bg-red-600 hover:bg-red-700 flex align-items-center",
                  style: { background: "red" },
                },
              ]}
              methods={methods}
            />
          </div>
          <div></div>
        </div>
      )}
    </>
  );
}
