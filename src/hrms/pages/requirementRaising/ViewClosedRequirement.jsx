import { useLocation } from "react-router-dom";

import { useEffect, useMemo, useState } from "react";
import { protectedCall } from "../../../services/userService";
import CustomFormWrapper from "../../../components/form/customForm/CustomFormWrapper";
import { useForm } from "react-hook-form";

export default function ViewClosedRequirement() {
  const [department, setDepartment] = useState([]);
  const [designation, setDesignation] = useState([]);

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

  const formDT = useMemo(
    () => [
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
      },
      {
        labelText: " Gender ",
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
        labelText: "Age Preference",
        name: "agePreference",
        id: "agePreference",
        placeholder: "-Select-",
        type: "select",
        defaultValue: "",
        disabled: "",
        options: ["21-30", "31-40", "41-50", "Above 50"],
        required: "Enter Organization District",
      },
      {
        labelText: "Work Experience",
        name: "workExperience",
        id: "workExperience",
        placeholder: "Select Experience",
        type: "radio",
        options: ["Fresher", "Experienced"],
        disabled: "",
        required: "Select Experience",
      },
    ],
    [designation, department]
  );

  const { state } = useLocation();
  const [newFormData, setFormData] = useState();
  const methods = useForm();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await protectedCall(`api/requirement/${state?.id}`);
        if (designation?.length && department?.length) {
          const formData = formDT?.map((elem) => {
            return { ...elem, defaultValue: data[elem?.id], disabled: true };
          });
          setFormData(formData);
        }
      } catch (error) {
        return error;
      }
    };
    fetchData();
  }, [state?.id, formDT, designation?.length, department?.length]);

  return (
    <CustomFormWrapper
      formName="View Closed Requirement"
      formDT={newFormData}
      submitButton={false}
      methods={methods}
    />
  );
}
