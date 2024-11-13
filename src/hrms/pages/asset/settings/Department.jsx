import { useNavigate } from "react-router-dom";

import { useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { protectedCall } from "../../../../services/userService";
import CustomForm from "../../../../components/form/customForm/CustomForm";
import { useForm } from "react-hook-form";
export default function Department() {
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
      fontWeight: "500",
      fontSize: "16px",
    },
  };

  const toast = useRef(null);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    try {
      const postAssetType = await protectedCall(
        "api/requirement/department",
        e,
        "post"
      );

      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: `Department type added successfully`,
      });
      const timer = setTimeout(() => {
        navigate("/department");
      }, 2000);
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: `Failed to add Department. Please try again.${error}}`,
      });
    }
  };

  const handleBack = async (e) => {
    e.preventDefault();
    navigate("/department");
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
            methods={methods}
            submitButton={true}
            formWrapperStyle={{ justifyContent: "start" }}
          />
        </div>
        <div></div>
      </div>
    </>
  );
}
