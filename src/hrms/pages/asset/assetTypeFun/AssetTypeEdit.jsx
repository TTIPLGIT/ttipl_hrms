import { useLocation, useNavigate } from "react-router-dom";

import { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { protectedCall } from "../../../../services/userService";
import CustomFormWrapper from "../../../../components/form/customForm/CustomFormWrapper";
import { useForm } from "react-hook-form";

export default function AssetTypeEdit() {
  const [assetTypeData, setAssetTypeData] = useState([]);
  const methods = useForm();

  const formDT = [
    {
      labelText: (
        <span>
          Asset Name<span className="text-red-600">*</span>
        </span>
      ),
      name: "assetName",
      id: "assetName",
      type: "text",
      disabled: "",
      defaultValue: "",

      required: "Enter asset Name",
    },
    {
      labelText: (
        <span>
          Asset Description<span className="text-red-600">*</span>
        </span>
      ),
      name: "assetDescription",
      id: "assetDescription",
      type: "text",
      disabled: "",
      defaultValue: "",

      required: "Enter asset Description",
    },
  ];
  const toast = useRef(null);

  const navigate = useNavigate();
  const { state } = useLocation();
  const [newFormData, setFormData] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await protectedCall(`api/asset/asset-type/${state?.id}`);
        const formData = formDT?.map((elem) => {
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
    navigate("/asset_type");
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
        formName="Edit Asset Type"
        formDT={newFormData}
        submitAction={async (e) => {
          try {
            const dataWithId = { id: state?.id, ...e };
            const response = await protectedCall(
              `api/asset/update-asset-type`,
              dataWithId,
              "post"
            );

            // Show success toast
            toast.current.show({
              severity: "success",
              summary: "Success",
              detail: response.message || "Asset updated successfully",
            });

            setTimeout(() => {
              navigate("/asset_type");
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
