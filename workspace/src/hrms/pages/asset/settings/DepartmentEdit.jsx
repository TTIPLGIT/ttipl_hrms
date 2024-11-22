import { useLocation, useNavigate } from "react-router-dom";

import { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { protectedCall } from "../../../../services/userService";
import CustomFormWrapper from "../../../../components/form/customForm/CustomFormWrapper";
import { useForm } from "react-hook-form";

export default function DepartmentEdit() {
  const [assetTypeData, setAssetTypeData] = useState([]);
  const methods = useForm();

  const formDT = [
    {
      labelText: (
        <span>
          Department<span className="text-red-600">*</span>
        </span>
      ),
      name: "department",
      id: "department",
      type: "text",
      disabled: "",
      placeholder: "Enter Department",
      required: "Enter Department",
    },
    {
      labelText: (
        <span>
          Status<span className="text-red-600">*</span>
        </span>
      ),
      name: "isActive",
      id: "isActive",
      type: "select",
      options: ["active", "in-active"],
      disabled: "",
      placeholder: "Enter Status",
    },
  ];

  const toast = useRef(null);

  const navigate = useNavigate();
  const { state } = useLocation();
  const [newFormData, setFormData] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await protectedCall(
          `api/requirement/department/${state?.id}`
        );
        const formData = formDT?.map((elem) => {
          if (elem.id === "isActive") {
            return {
              ...elem,
              defaultValue: data.isActive ? "active" : "in-active",
            };
          }
          return { ...elem, defaultValue: data[elem?.id] };
        });
        setFormData(formData);
      } catch (error) {
        return error;
      }
    };
    fetchData();
  }, [state?.id]);

  const handleBack = async (e) => {
    e.preventDefault();
    navigate("/department");
  };

  return (
    <>
      {" "}
      <Toast ref={toast} />
      <CustomFormWrapper
        formName="Edit Department"
        formDT={newFormData}
        submitAction={async (e) => {
          try {
            const dataWithId = {
              id: state?.id,
              ...e,
              isActive: e.isActive === "active" ? "true" : "false",
            };
            const response = await protectedCall(
              `api/requirement/department/update`,
              dataWithId,
              "post"
            );

            // Show success toast
            toast.current.show({
              severity: "success",
              summary: "Success",
              detail: response.message || "Department updated successfully",
            });

            setTimeout(() => {
              navigate("/department");
            }, 2000); // 2000ms = 2 seconds
          } catch (error) {
            // Show error toast
            toast.current.show({
              severity: "error",
              summary: "Error",
              detail: "Failed to update Department. Please try again.",
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
        ]}
        methods={methods}
      />
    </>
  );
}
