import { useNavigate } from "react-router-dom";

import { useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { protectedCall } from "../../../../services/userService";
import CustomForm from "../../../../components/form/customForm/CustomForm";
export default function Designation() {
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
  ];
  const formStyles = {
    noOfFledsInARow: {
      sm: 12,
      md: 12,
      lg: 12,
      xl: 5,
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
      fontWeight: "600",
      fontSize: "16px",
    },
  };

  const toast = useRef(null);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    try {
      const postAssetType = await protectedCall(
        "api/requirement/designation",
        e, // Send the object directly
        "post"
      );

      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: `Designation type added successfully`,
      });
      const timer = setTimeout(() => {
        navigate("/designation");
      }, 2000);
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: `Failed to add Designation. Please try again.${error}}`,
      });
    }
  };

  const handleBack = async (e) => {
    e.preventDefault();
    navigate("/designation");
  };
  return (
    <>
      <div>
        <Toast ref={toast} />

        <div className="bg-white p-4">
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
            ]}
          />
        </div>
        <div></div>
      </div>
    </>
  );
}
