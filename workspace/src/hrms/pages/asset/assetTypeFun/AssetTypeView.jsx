import { useLocation } from "react-router-dom";

import { useEffect, useState } from "react";
import { protectedCall } from "../../../../services/userService";
import CustomFormWrapper from "../../../../components/form/customForm/CustomFormWrapper";
import { useForm } from "react-hook-form";

export default function AssetTypeView() {
  const [assetTypeData, setAssetTypeData] = useState([]);

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
      required: "Enter asset Description",
    },
  ];

  const { state } = useLocation();
  const [newFormData, setFormData] = useState();
  const methods = useForm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await protectedCall(`api/asset/asset-type/${state?.id}`);
        const formData = formDT?.map((elem) => {
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
      formName="View Asset Type"
      formDT={newFormData}
      submitButton={false}
      methods={methods}
    />
  );
}
