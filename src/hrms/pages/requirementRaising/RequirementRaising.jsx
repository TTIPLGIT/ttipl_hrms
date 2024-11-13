import { useNavigate } from "react-router-dom";

import { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { protectedCall } from "../../../services/userService";
import CustomForm from "../../../components/form/customForm/CustomForm";
import { useForm } from "react-hook-form";

const formStyles = {
  noOfFledsInARow: {
    sm: 12,
    md: 12,
    lg: 12,
    xl: 6,
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

export default function RequirementRaising() {
  const [department, setDepartment] = useState([]);
  const [designation, setDesignation] = useState([]);
  const methods = useForm();

  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        const departmentData = await protectedCall(
          "api/requirement/department"
        );
        const extractDepartment = departmentData.map((i) => ({
          department: i.department,
        }));
        setDepartment(extractDepartment);

        const designationData = await protectedCall(
          "api/requirement/designation"
        );
        const extractDesignation = designationData.map((i) => ({
          designation: i.designation,
        }));
        setDesignation(extractDesignation);
      } catch (error) {
        console.log(error);
      }
    };
    fetchDepartment();
  }, []);

  // Custom validation to ensure only future dates are selectable
  const handleFutureDates = (selectedDate) => {
    const currentDate = new Date();
    const inputDate = new Date(selectedDate);
    return inputDate > currentDate || "Please select a future date";
  };

  const formDT = [
    {
      labelText: (
        <span>
          Department <span className="text-red-600">*</span>
        </span>
      ),
      name: "department",
      id: "department",
      placeholder: "-Select-",
      type: "select",
      defaultValue: "",
      disabled: "",
      options: department.map((i) => i.department),
      required: "Select Department  ",
    },
    {
      labelText: (
        <span>
          Designation<span className="text-red-600">*</span>
        </span>
      ),
      name: "designation",
      id: "designation",
      placeholder: "-Select-",
      type: "select",
      defaultValue: "",
      disabled: "",
      options: designation.map((i) => i.designation),
      required: "Select Designation",
    },
    {
      labelText: (
        <span>
          Number of Posts<span className="text-red-600">*</span>
        </span>
      ),
      name: "numberOfPosts",
      id: "numberOfPosts",
      placeholder: "#####",
      type: "text",
      defaultValue: "",
      disabled: "",
      required: "Enter Number of Posts",
    },
    {
      labelText: (
        <span>
          Last Date of Registration<span className="text-red-600">*</span>
        </span>
      ),
      name: "lastDateOfRegistration",
      id: "lastDateOfRegistration",
      type: "date",
      defaultValue: "",
      disabled: "",
      required: "Select Last Date of Registration",
      validation: { handleFutureDates },
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
          Age Preference <span className="text-red-600">*</span>
        </span>
      ),
      name: "agePreference",
      id: "agePreference",
      placeholder: "-Select-",
      type: "select",
      defaultValue: "",
      disabled: "",
      options: ["21-30", "31-40", "41-50", "Above 50"],
      required: "Select Age Preference",
    },
    {
      labelText: (
        <span>
          Work Experience <span className="text-red-600">*</span>{" "}
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
  ];

  const toast = useRef(null);
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      const response = await protectedCall(
        "api/requirement/create",
        formData,
        "post"
      );

      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: `Requirement Raised successfully: ${response.data.organizationName}`,
      });
      setTimeout(() => {
        navigate("/open_requirements");
      }, 1000);
    } catch (error) {
      console.error("Error submitting the form:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: `Failed to add Raise Requirement. Please try again. ${error.response.data.message}`,
      });
    }
  };

  const handleBack = async (e) => {
    e.preventDefault();
    navigate("/open_requirements");
  };
  const handleCancel = async (e) => {
    e.preventDefault();
    methods.reset();
  };
  return (
    <>
      <Toast ref={toast} />
      <style>
        {`
    .p-toast {
      z-index: 9999 !important;
    }
  `}
      </style>
      <div>
        <div className="p-4">
          <CustomForm
            formDT={formDT}
            formStyles={formStyles}
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
    </>
  );
}
