import { useNavigate } from "react-router-dom";
import CustomForm from "../../../components/form/customForm/CustomForm";
import { protectedCall, unProtectedCall } from "../../../services/userService";

import { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { useForm } from "react-hook-form";
export default function AssetType() {
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
      placeholder: "Enter Asset Name",
      required: "Enter Asset Name",
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
      placeholder: "Enter asset Description",
      required: "Enter Asset Description",
    },
  ];

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

  const toast = useRef(null);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    try {
      const postAssetType = await protectedCall(
        "api/asset/type",
        e, // Send the object directly
        "post"
      );

      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: `Asset type added successfully`,
      });
      const timer = setTimeout(() => {
        navigate("/asset_type");
      }, 2000);
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: `Failed to add asset type. Please try again.${error}}`,
      });
    }
  };

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
      <div>
        <Toast ref={toast} />

        <div className="p-6 bg-white">
          {" "}
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
