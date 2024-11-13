import { useLocation, useNavigate } from "react-router-dom";

import { useEffect, useMemo, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import CustomFormWrapper from "../../../../components/form/customForm/CustomFormWrapper";
import { protectedCall } from "../../../../services/userService";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
export default function InventoryEdit() {
  const [assetTypeData1, setAssetTypeData] = useState([]);
  const methods = useForm();

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
        disabled: false,
        defaultValue: "",
      },
      {
        labelText: <span>Asset Type</span>,
        name: "assetType",
        id: "assetType",
        type: "select",
        disabled: false,
        defaultValue: "",
        options: assetTypeData1?.map((i) => i?.assetType),
      },
      {
        labelText: <span>Make</span>,
        name: "make",
        id: "make",
        type: "text",
        disabled: false,
        defaultValue: "",
      },
      {
        labelText: <span>Model</span>,
        name: "model",
        id: "model",
        type: "text",
        disabled: false,
        defaultValue: "",
      },
      {
        labelText: <span>Vendor</span>,
        name: "vendor",
        id: "vendor",
        type: "text",
        disabled: false,
        defaultValue: "",
      },
      {
        labelText: <span>Serial number</span>,
        name: "serialNumber",
        id: "serialNumber",
        type: "text",
        disabled: false,
        defaultValue: "",
      },
      {
        labelText: <span>Price</span>,
        name: "price",
        id: "price",
        type: "text",
        disabled: false,
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
        disabled: false,
      },
    ],
    [assetTypeData1]
  );

  const toast = useRef(null);

  const navigate = useNavigate();
  const { state } = useLocation();
  const [newFormData, setFormData] = useState();

  useEffect(() => {
    const fetchInventoryData = async () => {
      try {
        // Make the API call to fetch inventory data
        const data = await protectedCall(`api/inventory/${state?.id}`);

        if (assetTypeData1?.length) {
          const formData = formDT?.map((elem) => {
            if (elem.id === "assetType") {
              console.log(data);

              return {
                ...elem,
                defaultValue: data?.asset?.assetName,
              };
            } else if (elem.id === "dateOfPurchase" && data.dateOfPurchase) {
              return {
                ...elem,
                defaultValue: format(
                  new Date(data.dateOfPurchase),
                  "dd-MM-yyyy"
                ),
              };
            }
            // Map other fields normally with inventory data
            return {
              ...elem,
              defaultValue: data[elem?.id] || data?.asset?.[elem?.id],
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

  const handleBack = async (e) => {
    e.preventDefault();
    navigate("/inventory_list");
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
        formName="Edit Inventory"
        formDT={newFormData}
        submitAction={async (e) => {
          if (isNaN(e.price) || e.price.trim() === "") {
            console.error("Price must be a valid number");
            return; // Exit if price is invalid
          }
          e.price = parseFloat(e.price); // Convert price to a number

          const selectedAssetType = e.assetType;
          const selectedAssetId = assetTypeData1.find(
            (i) => i.assetType === selectedAssetType
          );

          if (selectedAssetId) {
            e.assetTypeId = selectedAssetId.id; // Add the asset type ID to the object
          } else {
            console.error("Asset type not found"); // Log error if asset type is not found
            return; // Exit if asset type is not found
          }

          delete e.assetType; // Delete assetType

          try {
            const dataWithId = { id: state?.id, ...e };
            const response = await protectedCall(
              `api/inventory/update`,
              dataWithId,
              "post"
            );

            // Show success toast
            toast.current.show({
              severity: "success",
              summary: "Success",
              detail: response.message || "Inventory updated successfully",
            });

            setTimeout(() => {
              navigate("/inventory_list");
            }, 2000); // 2000ms = 2 seconds
          } catch (error) {
            // Show error toast
            toast.current.show({
              severity: "error",
              summary: "Error",
              detail: "Failed to update inventory. Please try again.",
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
