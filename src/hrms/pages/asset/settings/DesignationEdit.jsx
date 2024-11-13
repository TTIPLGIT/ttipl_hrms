import { useLocation, useNavigate } from "react-router-dom";

import { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { protectedCall } from "../../../../services/userService";
import CustomFormWrapper from "../../../../components/form/customForm/CustomFormWrapper";

export default function DesignationEdit() {
  const [assetTypeData, setAssetTypeData] = useState([]);

  const formDT = [
    {
      labelText: (
        <span>
          Designation<span className="text-red-600">*</span>
        </span>
      ),
      name: "designation",
      id: "designation",
      type: "text",
      disabled: "",
      placeholder: "Enter Designation",
      required: "Enter Designation",
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
          `api/requirement/designation/${state?.id}`
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
    navigate("/designation");
  };

  return (
    <>
      {" "}
      <Toast ref={toast} />
      <CustomFormWrapper
        formName="Edit Designation"
        formDT={newFormData}
        submitAction={async (e) => {
          try {
            const dataWithId = {
              id: state?.id,
              ...e,
              isActive: e.isActive === "active" ? "true" : "false",
            };
            const response = await protectedCall(
              `api/requirement/designation/update`,
              dataWithId,
              "post"
            );

            // Show success toast
            toast.current.show({
              severity: "success",
              summary: "Success",
              detail: response.message || "Designation updated successfully",
            });

            setTimeout(() => {
              navigate("/designation");
            }, 2000); // 2000ms = 2 seconds
          } catch (error) {
            // Show error toast
            toast.current.show({
              severity: "error",
              summary: "Error",
              detail: "Failed to update Designation. Please try again.",
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
      />
    </>
  );
}
