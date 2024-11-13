import { useLocation } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { protectedCall } from "../../../services/userService";
import CustomFormWrapper from "../../../components/form/customForm/CustomFormWrapper";
import { useForm } from "react-hook-form";

export default function ViewOpenRequirement() {
  const [department, setDepartment] = useState([]);
  const [designation, setDesignation] = useState([]);
  const [newFormData, setFormData] = useState([]);
  const methods = useForm();

  const { state } = useLocation();

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
      } catch (error) {
        console.log(error);
      }
    };

    const fetchDesignation = async () => {
      try {
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
    fetchDesignation();
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
        options: department.map((i) => i.department),
        required: "Select Department",
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
        required: "Select Last Date of Registration",
      },
      {
        labelText: " Gender ",
        name: "gender",
        id: "gender",
        placeholder: "Select Gender",
        type: "radio",
        options: ["Male", "Female"],
        required: "Select Gender",
      },
      {
        labelText: "Age Preference",
        name: "agePreference",
        id: "agePreference",
        placeholder: "-Select-",
        type: "select",
        options: ["21-30", "31-40", "41-50", "Above 50"],
        required: "Select Age Preference",
      },
      {
        labelText: "Work Experience",
        name: "workExperience",
        id: "workExperience",
        placeholder: "Select Experience",
        type: "radio",
        options: ["Fresher", "Experienced"],
        required: "Select Experience",
      },
    ],
    [designation, department]
  );

  useEffect(() => {
    const fetchRequirementDetails = async () => {
      if (state?.id) {
        try {
          const data = await protectedCall(`api/requirement/${state.id}`);

          if (designation?.length && department?.length) {
            const formData = formDT?.map((elem) => {
              return { ...elem, defaultValue: data[elem?.id], disabled: true };
            });
            setFormData(formData);
          }
        } catch (error) {
          console.log(error);
        }
      }
    };

    fetchRequirementDetails();
  }, [state?.id, formDT, designation?.length, department?.length]);

  return (
    <CustomFormWrapper
      formName="View Open Requirement"
      formDT={newFormData}
      submitButton={false}
      methods={methods}
    />
  );
}
