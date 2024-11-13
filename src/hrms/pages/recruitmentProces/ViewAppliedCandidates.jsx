import { useLocation, useNavigate } from "react-router-dom";

import { useEffect, useMemo, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { protectedCall } from "../../../services/userService";
import CustomFormWrapper from "../../../components/form/customForm/CustomFormWrapper";
import { useSelector } from "react-redux";
import { selectLoggedUser } from "../../../pages/login/loginSlice";
export default function ViewAppliedCandidates() {
  const loggedUser = useSelector(selectLoggedUser);
  const loggedUserEmail = loggedUser.email; // Access the stored email
  const [requirement, setRequirements] = useState([]);
  const [requirementDropDown, setRequirementsDropDown] = useState([]);
  const { state } = useLocation();
  const [newFormData, setFormData] = useState();

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
        required: "Enter First Name", // Validation message
      },
      {
        labelText: "Last Name",
        name: "lastName",
        id: "lastName",
        placeholder: "Enter Last Name",
        type: "text",
        defaultValue: "",
        disabled: "",
        required: "Enter Last Name", // Validation message
      },
      {
        labelText: "Personal Email",
        name: "personalEmail",
        id: "personalEmail",
        placeholder: "Enter Email",
        type: "text", // Correct type for email
        defaultValue: "",
        disabled: "",
        required: "Enter Email", // Validation message
      },
      {
        labelText: "Mobile Number",
        name: "mobileNumber",
        id: "mobileNumber",
        placeholder: "Enter Mobile Number",
        type: "phone", // Use 'tel' for phone numbers
        defaultValue: "",
        disabled: "",
        required: "Enter Mobile Number", // Validation message
      },
      {
        labelText: "Gender",
        name: "gender",
        id: "gender",
        placeholder: "Enter Gender",
        type: "radio",
        defaultValue: "male",
        disabled: "",
        options: ["Male", "Female"],
        required: "Select Gender", // Validation message
      },
      {
        labelText: "Date of Birth",
        name: "dateOfBirth",
        id: "dateOfBirth",
        placeholder: "Select Date of Birth",
        type: "date", // Use 'date' type for date inputs
        defaultValue: "",
        disabled: "",
        required: "Enter Date of Birth", // Validation message
        // validation: (e) => e === "akash" || "Wrong",
        validation: { ageValidation },
      },
      {
        labelText: "Address",
        name: "address",
        id: "address",
        placeholder: "Enter Address",
        type: "textarea", // Textarea for multiline inputs
        defaultValue: "",
        disabled: "",
        required: "Enter Address", // Validation message
      },
      {
        labelText: "City",
        name: "city",
        id: "city",
        placeholder: "Enter City",
        type: "text",
        defaultValue: "",
        disabled: "",
        required: "Enter City", // Validation message
      },
      {
        labelText: "State",
        name: "state",
        id: "state",
        placeholder: "-Select-",
        type: "select",
        defaultValue: "",
        disabled: "",
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
        required: "Enter State", // Validation message
      },
      {
        labelText: "Postal Code",
        name: "postalCode",
        id: "postalCode",
        placeholder: "Enter Postal Code",
        type: "text",
        defaultValue: "",
        disabled: "",
        required: "Enter Postal Code", // Validation message
      },
      {
        labelText: "Country",
        name: "country",
        id: "country",
        placeholder: "Enter Country",
        type: "text",
        defaultValue: "",
        disabled: "",
        required: "Enter Country", // Validation message
      },
      {
        labelText: "Work Experience",
        name: "workExperience",
        id: "workExperience",
        placeholder: "Enter Work Experience",
        type: "text",
        defaultValue: "",
        disabled: "",
        required: "Enter Work Experience", // Validation message
      },
      {
        labelText: "Position Applying For",
        name: "applyingFor",
        id: "applyingFor",
        placeholder: "Enter Position",
        type: "select",
        options: requirementDropDown,
        defaultValue: "Software Engineer",
        disabled: "",
        required: "Enter Position", // Validation message
      },
      //   {
      //     labelText: "Resume",
      //     name: "resume",
      //     id: "resume",
      //     placeholder: "Upload Resume",
      //     type: "file", // For file uploads
      //     disabled: "",
      //     required: "Upload Resume", // Validation message
      //   },
    ],
    [requirementDropDown]
  );

  useEffect(() => {
    const fetchRequirement = async () => {
      try {
        const data = await protectedCall("api/requirement/all/positions");
        setRequirements(
          data.map((i) => ({ id: i.id, designation: i.designation }))
        );
        console.log(data, "data");
      } catch (error) {
        console.log(error);
      }
    };
    fetchRequirement();
  }, []);
  useEffect(() => {
    setRequirementsDropDown(requirement.map((i) => i.designation));
  }, [requirement]);

  const toast = useRef(null);

  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await protectedCall(
          `api/candidate-applications/${state?.id}`
        );
        if (requirementDropDown?.length) {
          const formData = formDT?.map((elem) => {
            return {
              ...elem,
              defaultValue: data[elem?.id] || "",
              disabled: true,
            };
          });

          setFormData(formData);
        }
      } catch (error) {
        return error;
      }
    };

    fetchData();
  }, [state?.id, formDT, requirementDropDown?.length]);
  console.log(`api/requirement/${state?.id}`);

  return (
    <>
      {" "}
      <Toast ref={toast} />
      <CustomFormWrapper
        formName="View Applied Candidate"
        formDT={newFormData}
        submitButton={false}
      />
    </>
  );
}
