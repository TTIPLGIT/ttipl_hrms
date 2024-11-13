import { useLocation } from "react-router-dom";

import { useEffect, useMemo, useState } from "react";
import { protectedCall } from "../../../../services/userService";
import CustomFormWrapper from "../../../../components/form/customForm/CustomFormWrapper";
import { useForm } from "react-hook-form";
import InfinityLoader from "../../../../components/loader/Infinity";

export default function AssetView() {
  const [empId, SetEmpId] = useState([1]);
  const [assetType, setAssetType] = useState([]);
  const [assetName, setAssetName] = useState([]);
  const [serialNumber, setSerialNumber] = useState([]);
  const [loader, setLoader] = useState(false);
  const methods = useForm();

  useEffect(() => {
    const fetchEmpId = async () => {
      setLoader(true);
      try {
        const empIdData = await protectedCall("api/employee");
        const extractEmpId = empIdData.map((i) => ({
          id: i.employeeId,
        }));
        SetEmpId(extractEmpId);

        const assetTypeData = await protectedCall("api/asset/asset-type");
        const extractAssetType = assetTypeData.map((i) => ({
          data: i.assetName,
        }));

        setAssetName(extractAssetType);

        const assetData = await protectedCall("api/inventory");
        const extractAssetName = assetData.map((i) => ({
          data: i.assetName,
          serialno: i.serialNumber,
        }));
        setAssetType(extractAssetName);
      } catch (error) {
        // console.log(error);
      } finally {
        setLoader(false);
      }
    };
    fetchEmpId();
  }, []);

  // useEffect(() => {
  //   const fetchAssetType = async () => {
  //     try {
  //       const assetTypeData = await protectedCall("api/asset/asset-type");
  //       const extractAssetType = assetTypeData.map((i) => ({
  //         data: i.assetName,
  //       }));

  //       setAssetName(extractAssetType);
  //     } catch (error) {
  //       // console.log(error);
  //     }
  //   };
  //   fetchAssetType();
  // }, []);

  // useEffect(() => {
  //   const fetchAsset = async () => {
  //     try {
  //       const assetData = await protectedCall("api/inventory");
  //       const extractAssetName = assetData.map((i) => ({
  //         data: i.assetName,
  //         serialno: i.serialNumber,
  //       }));
  //       setAssetType(extractAssetName);
  //     } catch (error) {
  //       // console.log(error);
  //     }
  //   };
  //   fetchAsset();
  // }, []);

  const formDT = useMemo(
    () => [
      {
        labelText: <span>Employee ID</span>,
        name: "employeeId",
        id: "employeeId",
        type: "select",
        options: empId?.map((i) => i?.id),
        disabled: "",
        defaultValue: "",
      },
      {
        labelText: <span>Asset Type</span>,
        name: "assetType",
        id: "assetType",
        type: "select",
        defaultValue: "",

        disabled: "",
        options: assetName.map((i) => i.data),
      },
      {
        labelText: <span>Asset Name</span>,
        name: "assetName",
        id: "assetName",
        defaultValue: "",

        type: "select",
        disabled: "",
        options: assetType.map((i) => i.data),
      },
      {
        labelText: <span>Serial number</span>,
        name: "serialNumber",
        id: "serialNumber",
        type: "select",
        defaultValue: "",

        options: assetType.map((i) => i.serialno),
      },
      {
        labelText: <span>Status</span>,
        name: "status",
        id: "status",
        defaultValue: "",

        type: "select",
        options: ["Active", "Damaged", "In-Service"],
      },
      {
        labelText: <span>Given on</span>,
        name: "givenOn",
        id: "givenOn",
        type: "date",
        defaultValue: "1990-01-15",
        disabled: "",
      },
      {
        labelText: <span>Returned on</span>,
        name: "returnedOn",
        id: "returnedOn",
        defaultValue: "",

        type: "date",
        disabled: "",
      },
    ],
    [empId, assetType, assetName]
  );

  const { state } = useLocation();
  const [newFormData, setFormData] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await protectedCall(`api/asset/${state?.id}`);
        if (empId?.length && assetType?.length && assetName?.length) {
          const formData = formDT?.map((elem) => {
            return { ...elem, defaultValue: data[elem?.id], disabled: true };
          });
          setFormData(formData);
        }
      } catch (error) {
        return error;
      }
    };
    fetchData();
  }, [state?.id, formDT, empId?.length, assetType?.length, assetName?.length]);

  return (
    <div className="">
      {loader && <InfinityLoader />}
      <CustomFormWrapper
        formName="View Asset"
        formDT={newFormData}
        submitButton={false}
        methods={methods}
      />
    </div>
  );
}
