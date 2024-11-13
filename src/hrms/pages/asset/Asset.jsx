import { useNavigate } from "react-router-dom";
import CustomForm from "../../../components/form/customForm/CustomForm";
import { protectedCall } from "../../../services/userService";

import { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { useForm } from "react-hook-form";
export default function Asset() {
  const toast = useRef(null);
  const methods = useForm();

  const [empId, SetEmpId] = useState([1]);
  const [assetType, setAssetType] = useState([]);
  const [assetName, setAssetName] = useState([]);
  const [serialNumber, setSerialNumber] = useState([]);

  useEffect(() => {
    const fetchEmpId = async () => {
      try {
        const empIdData = await protectedCall("api/employee");
        const extractEmpId = empIdData.map((i) => ({
          id: i.employeeId,
        }));
        SetEmpId(extractEmpId);
      } catch (error) {
        // console.log(error);
      }
    };
    fetchEmpId();
  }, []);

  useEffect(() => {
    const fetchAssetType = async () => {
      try {
        const assetTypeData = await protectedCall("api/asset/asset-type");
        const extractAssetType = assetTypeData.map((i) => ({
          data: i.assetName,
        }));

        setAssetName(extractAssetType);
      } catch (error) {
        // console.log(error);
      }
    };
    fetchAssetType();
  }, []);

  useEffect(() => {
    const fetchAsset = async () => {
      try {
        const assetData = await protectedCall("api/inventory");
        const extractAssetName = assetData.map((i) => ({
          data: i.assetName,
          serialno: i.serialNumber,
        }));
        setAssetType(extractAssetName);
      } catch (error) {
        // console.log(error);
      }
    };
    fetchAsset();
  }, []);

  const formDT = [
    {
      labelText: (
        <span>
          Employee ID<span className="text-red-600">*</span>
        </span>
      ),
      name: "employeeId",
      id: "employeeId",
      type: "select",
      options: empId.map((i) => i.id),
      disabled: "",
      required: "Select Employee Id ",
      placeholder: "Select Employee Id ",
    },
    {
      labelText: (
        <span>
          Asset Type<span className="text-red-600">*</span>
        </span>
      ),
      name: "assetType",
      id: "assetType",
      type: "select",
      disabled: "",
      placeholder: "Select Asset Type ",
      required: "Select Asset Type",
      options: assetName.map((i) => i.data),
    },
    {
      labelText: (
        <span>
          Asset Name<span className="text-red-600">*</span>
        </span>
      ),
      name: "assetName",
      id: "assetName",
      type: "select",
      placeholder: "Select Asset Name ",
      disabled: "",
      required: "Select Asset Name",
      options: assetType.map((i) => i.data),
    },
    {
      labelText: (
        <span>
          Serial number<span className="text-red-600">*</span>
        </span>
      ),
      name: "serialNumber",
      id: "serialNumber",
      type: "select",
      placeholder: "Select Serial Number",
      required: "Select Serial Number",
      options: assetType.map((i) => i.serialno),
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
      placeholder: "Select Status ",

      required: "Select status",
      options: ["Active", "Damaged", "In-Service"],
    },
    {
      labelText: (
        <span>
          Given on <span className="text-red-600">*</span>
        </span>
      ),
      name: "givenOn",
      id: "givenOn",
      type: "date",
      defaultValue: "",
      disabled: "",
      required: "Enter Given date",
    },
    {
      labelText: <span>Returned on</span>,
      name: "returnedOn",
      id: "returnedOn",
      type: "date",
      disabled: "",
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

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    try {
      const assetPost = await protectedCall("api/asset", e, "post");
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: `Asset have to assigned successfully to: ${e.employeeId}`,
      });
      const timer = setTimeout(() => {
        navigate("/asset_list");
      }, 2000);
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: `Failed to assign asset. Please try again.${error}}`,
      });
    }
  };

  const handleBack = async (e) => {
    e.preventDefault();
    navigate("/asset_list");
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
