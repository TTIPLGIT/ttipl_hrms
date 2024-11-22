import { useLocation } from "react-router-dom";

import { useEffect, useState } from "react";
import { protectedCall } from "../../../../services/userService";
import CustomFormWrapper from "../../../../components/form/customForm/CustomFormWrapper";

export default function DepartmentView() {
  const [assetTypeData, setAssetTypeData] = useState([]);

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
      default: "",
      required: "Enter Department",
    },
    // {
    //   labelText: (
    //     <span>
    //       Status<span className="text-red-600">*</span>
    //     </span>
    //   ),
    //   name: "isActive",
    //   id: "isActive",
    //   type: "select",
    //   options: ["active", "in-active"],
    //   disabled: "",
    //   placeholder: "Enter Status",
    // },
  ];

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
          return { ...elem, defaultValue: data[elem?.id], disabled: true };
        });
        setFormData(formData);
      } catch (error) {
        return error;
      }
    };
    fetchData();
  }, [state?.id]);

  return (
    <CustomFormWrapper
      formName="View Department"
      formDT={newFormData}
      submitButton={false}
    />
  );
}
