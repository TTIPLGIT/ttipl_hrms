import { useLocation } from "react-router-dom";

import { useEffect, useState } from "react";
import { protectedCall } from "../../../services/userService";
import CustomFormWrapper from "../../../components/form/customForm/CustomFormWrapper";
import { useSelector } from "react-redux";
import { selectLoggedUser } from "../../../pages/login/loginSlice";

const formDT = [
  {
    labelText: "First Name",
    name: "firstName",
    id: "firstName",
    placeholder: "Enter First Name",
    type: "text",
    defaultValue: "",
    disabled: "",
    required: "Enter First Name",
  },
  {
    labelText: "Last Name",
    name: "lastName",
    id: "lastName",
    placeholder: "Enter Last Name",
    type: "text",
    defaultValue: "",
    disabled: "",
    required: "Enter Last Name",
  },
  {
    labelText: "Personal Email",
    name: "personalEmail",
    id: "personalEmail",
    placeholder: "Enter Personal Email",
    type: "email",
    defaultValue: "",
    disabled: "",
    required: "Enter Personal Email",
  },
  {
    labelText: "Mobile Number",
    name: "mobileNumber",
    id: "mobileNumber",
    placeholder: "Enter Mobile Number",
    type: "text",
    defaultValue: "",
    disabled: "",
    required: "Enter Mobile Number",
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
    required: "Select Gender",
  },
  {
    labelText: "Photo",
    name: "photo",
    id: "photo",
    placeholder: "Upload Photo",
    type: "text",
    defaultValue: "",
    disabled: "",
    required: "Upload Photo",
  },
  {
    labelText: "Employee ID",
    name: "employeeId",
    id: "employeeId",
    placeholder: "Enter Employee ID",
    type: "text",
    defaultValue: "",
    disabled: "",
    required: "Enter Employee ID",
  },
  {
    labelText: "Official Email",
    name: "officialEmail",
    id: "officialEmail",
    placeholder: "Enter Official Email",
    type: "email",
    defaultValue: "",
    disabled: "",
    required: "Enter Official Email",
  },
  {
    labelText: "Location",
    name: "location",
    id: "location",
    placeholder: "Select Location",
    type: "select",
    options: ["Location 1", "Location 2", "Location 11"],
    defaultValue: "",
    disabled: "",
    required: "Select Location",
  },
  {
    labelText: "Department",
    name: "department",
    id: "department",
    placeholder: "Select Department",
    type: "select",
    options: ["HR", "Finance", "Engineering", "Engineeri1ng"],
    defaultValue: "",
    disabled: "",
    required: "Select Department",
  },
  {
    labelText: "Designation",
    name: "designation",
    id: "designation",
    placeholder: "Enter Designation",
    type: "text",
    defaultValue: "",
    disabled: "",
    required: "Enter Designation",
  },
  {
    labelText: "Reporting To",
    name: "reportingTo",
    id: "reportingTo",
    placeholder: "Enter Reporting Manager",
    type: "text",
    defaultValue: "",
    disabled: "",
    required: "Enter Reporting Manager",
  },
  {
    labelText: "Date of Birth",
    name: "dateOfBirth",
    id: "dateOfBirth",
    placeholder: "Enter Date of Birth",
    type: "text",
    defaultValue: "",
    disabled: "",
    required: "Enter Date of Birth",
  },
  {
    labelText: "Date of Joining",
    name: "dateOfJoining",
    id: "dateOfJoining",
    placeholder: "Enter Date of Joining",
    type: "text",
    defaultValue: "",
    disabled: "",
    required: "Enter Date of Joining",
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
    required: "Select Experience",
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
    required: "Select Marital Status",
  },
  {
    labelText: "Blood Group",
    name: "bloodGroup",
    id: "bloodGroup",
    placeholder: "Enter Blood Group",
    type: "text",
    defaultValue: "",
    disabled: "",
    required: "Enter Blood Group",
  },
  {
    labelText: "Emergency Contact Person",
    name: "emergencyContactPerson",
    id: "emergencyContactPerson",
    placeholder: "Enter Emergency Contact Person",
    type: "text",
    defaultValue: "",
    disabled: "",
    required: "Enter Emergency Contact Person",
  },
  {
    labelText: "Relationship",
    name: "relationship",
    id: "relationship",
    placeholder: "Enter Relationship",
    type: "text",
    defaultValue: "",
    disabled: "",
    required: "Enter Relationship",
  },
  {
    labelText: "Contact Number",
    name: "contactNumber",
    id: "contactNumber",
    placeholder: "Enter Contact Number",
    type: "text",
    defaultValue: "",
    disabled: "",
    required: "Enter Contact Number",
  },
  {
    labelText: "Present Address",
    name: "presentAddress",
    id: "presentAddress",
    placeholder: "Enter Present Address",
    type: "text",
    defaultValue: "",
    disabled: "",
    required: "Enter Present Address",
  },
  {
    labelText: "Permanent Address",
    name: "permanentAddress",
    id: "permanentAddress",
    placeholder: "Enter Permanent Address",
    type: "text",
    defaultValue: "",
    disabled: "",
    required: "Enter Permanent Address",
  },
  {
    labelText: "Father's Name",
    name: "fatherName",
    id: "fatherName",
    placeholder: "Enter Father's Name",
    type: "text",
    defaultValue: "",
    disabled: "",
    required: "Enter Father's Name",
  },
  {
    labelText: "Mother's Name",
    name: "motherName",
    id: "motherName",
    placeholder: "Enter Mother's Name",
    type: "text",
    defaultValue: "",
    disabled: "",
    required: "Enter Mother's Name",
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
    required: "Select Employee Status",
  },
  {
    labelText: "Employee Type",
    name: "employeeType",
    id: "employeeType",
    placeholder: "Select Employee Type",
    type: "select",
    options: ["Full-Time", "Part-Time", "Contract"],
    defaultValue: "",
    disabled: "",
    required: "Select Employee Type",
  },
  {
    labelText: "Employee Level",
    name: "employeeLevel",
    id: "employeeLevel",
    placeholder: "Enter Employee Level",
    type: "text",
    defaultValue: "",
    disabled: "",
    required: "Enter Employee Level",
  },
  {
    labelText: "Organization ID",
    name: "organizationId",
    id: "organizationId",
    placeholder: "Enter Organization ID",
    type: "number",
    defaultValue: "",
    disabled: "",
    required: "Enter Organization ID",
  },
];
export default function MyProfile() {
  const loggedUser = useSelector(selectLoggedUser);
  const loggedUserId = loggedUser.employeeId; // Access the stored email
  const imagePreview = loggedUser.img;
  const { state } = useLocation();
  const [newFormData, setFormData] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await protectedCall(`api/employee/${loggedUserId}`);
        const formData = formDT?.map((elem) => {
          return { ...elem, defaultValue: data[elem?.id], disabled: true };
        });
        setFormData(formData);
      } catch (error) {
        return error;
      }
    };
    fetchData();
  }, [state?.id]);

  return (
    <div>
      {imagePreview && (
        <div>
          <h3>Profile Picture Preview:</h3>
          <img
            src={imagePreview}
            alt="Image Preview"
            style={{ width: "100px", height: "100px", objectFit: "cover" }} // Style as needed
          />
        </div>
      )}
      <div className="">
        <CustomFormWrapper
          formName="My profile"
          formDT={newFormData}
          submitButton={false}
        />
      </div>
    </div>
  );
}
