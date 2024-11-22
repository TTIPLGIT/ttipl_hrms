import { useNavigate } from "react-router-dom";
import CustomForm from "../../../components/form/customForm/CustomForm";
import { protectedCall } from "../../../services/userService";

import { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { useForm } from "react-hook-form";
export default function Inventory() {
  const [assetTypeData, setAssetTypeData] = useState([]);
  const methods = useForm();

  const formDT = [
    {
      labelText: (
        <span>
          Name<span className="text-red-600">*</span>
        </span>
      ),
      name: "assetName",
      id: "assetName",
      type: "text",
      disabled: "",
      placeholder: "Asset Name",
      required: "Enter asset Name",
    },
    {
      labelText: (
        <span>
          Type<span className="text-red-600">*</span>
        </span>
      ),
      name: "assetType",
      id: "assetType",
      type: "select",
      placeholder: "- select -",
      disabled: "",
      required: "Enter asset Type",
      options: assetTypeData.map((i) => i.assetType),
    },
    {
      labelText: (
        <span>
          Make<span className="text-red-600">*</span>
        </span>
      ),
      name: "make",
      id: "make",
      placeholder: "Make",
      type: "text",
      disabled: "",
      required: "Enter make name",
    },
    {
      labelText: (
        <span>
          Model<span className="text-red-600">*</span>
        </span>
      ),
      name: "model",
      id: "model",
      type: "text",
      placeholder: "Model",
      required: "Enter model name",
    },
    {
      labelText: (
        <span>
          Vendor<span className="text-red-600">*</span>
        </span>
      ),
      name: "vendor",
      id: "vendor",
      type: "text",
      placeholder: "Vendor",
      required: "Enter vendor name",
    },
    {
      labelText: (
        <span>
          Serial Number <span className="text-red-600">*</span>
        </span>
      ),
      name: "serialNumber",
      id: "serialNumber",
      type: "text",
      placeholder: "Serial Number",
      disabled: "",
      required: "Enter serial number",
    },
    {
      labelText: (
        <span>
          Price<span className="text-red-600">*</span>
        </span>
      ),
      name: "price",
      id: "price",
      placeholder: "Price",
      type: "text",
      required: "Enter price",
    },
    {
      labelText: (
        <span>
          Status<span className="text-red-600">*</span>
        </span>
      ),
      name: "status",
      id: "status",
      type: "select",
      options: ["Active", "inprogress"],
      placeholder: "- select -",
      required: "Select status",
    },
    {
      labelText: (
        <span>
          Date of purchase <span className="text-red-600">*</span>
        </span>
      ),
      name: "dateOfPurchase",
      id: "dateOfPurchase",
      type: "date",
      disabled: "",
      required: "Enter Purchase date",
    },
  ];

  const formStyles = {
    noOfFledsInARow: {
      sm: 12,
      md: 12,
      lg: 12,
      xl: 3,
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

  const toast = useRef(null);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    // Ensure price is a number
    if (isNaN(e.price) || e.price.trim() === "") {
      console.error("Price must be a valid number");
      return; // Exit if price is invalid
    }
    e.price = parseFloat(e.price); // Convert price to a number

    const selectedAssetType = e.assetType;
    const selectedAssetId = assetTypeData.find(
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
      const postInventory = await protectedCall(
        "api/inventory/create",
        e, // Send the object directly
        "post"
      );
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: `Inventory added successfully: ${postInventory.data.assetName}`,
      });
      const timer = setTimeout(() => {
        navigate("/inventory_list");
      }, 2000);
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: `Failed to add Inventory. Please try again.${error}}`,
      });
    }
  };

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
      <div>
        <Toast ref={toast} />

        <div className="p-4 bg-white">
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
