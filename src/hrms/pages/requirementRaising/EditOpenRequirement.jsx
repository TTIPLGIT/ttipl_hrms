import { useLocation, useNavigate } from "react-router-dom";

import { useEffect, useMemo, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { protectedCall } from "../../../services/userService";
import CustomFormWrapper from "../../../components/form/customForm/CustomFormWrapper";
import { format } from "date-fns";
import { useForm } from "react-hook-form";

export default function EditOpenRequirement() {
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
      } catch (error) {
        console.log(error);
      }
    };
    fetchDepartment();
  }, []);
  useEffect(() => {
    const fetchDepartment = async () => {
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
      },
      {
        labelText: "Work Experience",
        name: "workExperience",
        id: "workExperience",
        placeholder: "Select Experience",
        type: "radio",
        options: ["Fresher", "Experienced"],
        disabled: "",
      },
      {
        labelText: "Status",
        name: "status",
        id: "status",
        placeholder: "-select-",
        type: "select",
        options: ["open", "closed"],
        disabled: "",
      },
    ],
    [designation, department]
  );
  const toast = useRef(null);

  const navigate = useNavigate();
  const { state } = useLocation();
  const [newFormData, setFormData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await protectedCall(`api/requirement/${state?.id}`);

        if (designation?.length && department?.length) {
          const formData = formDT?.map((elem) => {
            if (elem.id === "lastDateOfRegistration") {
              return {
                ...elem,
                defaultValue: format(
                  new Date(data.lastDateOfRegistration),
                  "dd-MM-yyyy"
                ),
              };
            }
            return { ...elem, defaultValue: data[elem?.id] };
          });
          setFormData(formData);
        }
      } catch (error) {
        return error;
      }
    };
    fetchData();
  }, [state?.id, formDT, designation?.length, department?.length]);

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
      {" "}
      <Toast ref={toast} />
      <CustomFormWrapper
        formName="Edit Open Requirement"
        formDT={newFormData}
        submitAction={async (e) => {
          try {
            const dataWithId = { id: String(state?.id), ...e };
            const response = await protectedCall(
              `api/requirement/update`,
              dataWithId,
              "post"
            );
            console.log(response);

            // Show success toast
            toast.current.show({
              severity: "success",
              summary: "Success",
              detail: response.message || "Asset updated successfully",
            });

            setTimeout(() => {
              navigate("/open_requirements");
            }, 2000); // 2000ms = 2 seconds
          } catch (error) {
            // Show error toast
            toast.current.show({
              severity: "error",
              summary: "Error",
              detail: "Failed to update Asset. Please try again.",
            });
          }
        }}
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
    </>
  );
}
