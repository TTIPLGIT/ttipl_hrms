import { useLocation } from "react-router-dom";

import { useEffect, useMemo, useState } from "react";
import CustomFormWrapper from "../../../../components/form/customForm/CustomFormWrapper";
import { protectedCall } from "../../../../services/userService";
import { useForm } from "react-hook-form";

export default function InventoryView() {
  const [assetTypeData1, setAssetTypeData] = useState([]);

  useEffect(() => {
    const fetchAssetType = async () => {
      try {
        const assetTypeData = await protectedCall("api/asset/asset-type");
        const extractAssetType = assetTypeData.map((i) => ({
          assetType: i.assetName,
          id: i.id,
        }));
        setAssetTypeData(extractAssetType);
      } catch (error) {
        // console.log(error);
      }
    };
    fetchAssetType();
  }, []);

  const formDT = useMemo(
    () => [
      {
        labelText: <span>Asset Name</span>,
        name: "assetName",
        id: "assetName",
        type: "text",
        defaultValue: "",
      },
      {
        labelText: <span>Asset Type</span>,
        name: "assetType",
        id: "assetType",
        type: "select",
        defaultValue: "",
        options: assetTypeData1?.map((i) => i?.assetType),
      },
      {
        labelText: <span>Make</span>,
        name: "make",
        id: "make",
        type: "text",
        defaultValue: "",
      },
      {
        labelText: <span>Model</span>,
        name: "model",
        id: "model",
        type: "text",
        defaultValue: "",
      },
      {
        labelText: <span>Vendor</span>,
        name: "vendor",
        id: "vendor",
        type: "text",
        defaultValue: "",
      },
      {
        labelText: <span>Serial number</span>,
        name: "serialNumber",
        id: "serialNumber",
        type: "text",
        defaultValue: "",
      },
      {
        labelText: <span>Price</span>,
        name: "price",
        id: "price",
        type: "text",
        defaultValue: "",
      },
      {
        labelText: <span>Status</span>,
        name: "status",
        id: "status",
        type: "select",
        options: ["Active", "inprogress"],
        defaultValue: "",
      },
      {
        labelText: <span>Date of purchase</span>,
        name: "dateOfPurchase",
        id: "dateOfPurchase",
        type: "date",
        defaultValue: "",
      },
    ],
    [assetTypeData1]
  );

  const { state } = useLocation();
  const [newFormData, setFormData] = useState();
  const methods = useForm();

  useEffect(() => {
    const fetchInventoryData = async () => {
      try {
        // Make the API call to fetch inventory data
        const data = await protectedCall(`api/inventory/${state?.id}`);

        if (assetTypeData1?.length) {
          const formData = formDT?.map((elem) => {
            if (elem.id === "assetType") {
              return {
                ...elem,
                defaultValue: data?.asset?.assetName,
                disabled: true,
              };
            }
            // Map other fields normally with inventory data
            return {
              ...elem,
              defaultValue: data[elem?.id] || data?.asset?.[elem?.id],
              disabled: true,
            };
          });
          setFormData(formData); // Update form data state
        }
      } catch (error) {
        console.error("Failed to fetch inventory data", error);
      }
    };

    // Only trigger the fetch when state.id and dependencies are available
    if (state?.id && formDT && assetTypeData1?.length) {
      fetchInventoryData();
    }
  }, [state?.id, formDT, assetTypeData1?.length]);

  return (
    <CustomFormWrapper
      formName="Edit Inventory"
      formDT={newFormData}
      submitButton={false}
      methods={methods}
    />
  );
}
