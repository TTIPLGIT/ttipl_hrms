import { useLocation, useNavigate } from "react-router-dom";

import { useEffect, useMemo, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { protectedCall } from "../../../../services/userService";
import CustomFormWrapper from "../../../../components/form/customForm/CustomFormWrapper";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import InfinityLoader from "../../../../components/loader/Infinity";

export default function AssetEdit() {
  const [empId, SetEmpId] = useState([1]);
  const [assetType, setAssetType] = useState([]);
  const [assetName, setAssetName] = useState([]);
  const methods = useForm();
  const [loader, setLoader] = useState(false);

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
  const toast = useRef(null);

  const navigate = useNavigate();
  const { state } = useLocation();
  const [newFormData, setFormData] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await protectedCall(`api/asset/${state?.id}`);

        if (empId?.length && assetType?.length && assetName?.length) {
          const formData = formDT?.map((elem) => {
            if (elem.id === "givenOn") {
              return {
                ...elem,
                defaultValue: format(new Date(data.givenOn), "dd-MM-yyyy"),
              };
            }
            if (elem.id === "returnedOn") {
              return {
                ...elem,
                defaultValue: format(new Date(data.givenOn), "dd-MM-yyyy"),
              };
            }
            return { ...elem, defaultValue: data[elem?.id] };
          });
          setFormData(formData);
        }
      } catch (error) {
        return error;
      }
    };
    fetchData();
  }, [state?.id, formDT, empId?.length, assetType?.length, assetName?.length]);

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
      {" "}
      <Toast ref={toast} />
      {loader && <InfinityLoader />}
      <CustomFormWrapper
        formName="Edit Asset"
        formDT={newFormData}
        submitAction={async (e) => {
          try {
            const dataWithId = { id: state?.id, ...e };
            const response = await protectedCall(
              `api/asset/update-asset`,
              dataWithId,
              "post"
            );

            // Show success toast
            toast.current.show({
              severity: "success",
              summary: "Success",
              detail: response.message || "Asset updated successfully",
            });

            setTimeout(() => {
              navigate("/asset_list");
            }, 2000); // 2000ms = 2 seconds
          } catch (error) {
            // Show error toast
            toast.current.show({
              severity: "error",
              summary: "Error",
              detail: "Failed to update Asset. Please try again.",
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
