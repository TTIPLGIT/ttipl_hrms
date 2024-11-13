import { useLocation, useNavigate } from "react-router-dom";
import CustomFormWrapper from "../../../components/form/customForm/CustomFormWrapper";
import { protectedCall } from "../../../services/userService";

import { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { useForm } from "react-hook-form";

export default function OrganizationEdit() {
  const toast = useRef(null);
  const methods = useForm();
  const [imgView, setImgView] = useState(false);
  const navigate = useNavigate();
  const { state } = useLocation();
  const [newFormData, setFormData] = useState();
  const [logoView, setLogoView] = useState("");

  const formDT = [
    {
      labelText: "Organization Name",
      name: "name",
      id: "name",
      placeholder: "Enter Organization Name",
      type: "text",
      defaultValue: "",
      disabled: "",
      required: "Enter Organization Name ",
    },
    {
      labelText: "Organization State",
      name: "district",
      id: "district",
      placeholder: "Organization District",
      type: "select",
      defaultValue: "",
      options: [
        "Andhra Pradesh",
        "Arunachal Pradesh",
        "Assam",
        "Bihar",
        "Chhattisgarh",
        "Goa",
        "Gujarat",
        "Haryana",
        "Himachal Pradesh",
        "Jharkhand",
        "Karnataka",
        "Kerala",
        "Madhya Pradesh",
        "Maharashtra",
        "Manipur",
        "Meghalaya",
        "Mizoram",
        "Nagaland",
        "Odisha",
        "Punjab",
        "Rajasthan",
        "Sikkim",
        "Tamil Nadu",
        "Telangana",
        "Tripura",
        "Uttar Pradesh",
        "Uttarakhand",
        "West Bengal",
      ],
      disabled: "",
      required: "Enter Organization District",
    },
    {
      labelText: "Phone Number",
      name: "phoneNumber",
      id: "phoneNumber",
      placeholder: "Phone Number",
      type: "phone",
      defaultValue: "",
      disabled: "",
      required: "Enter Phone Number",
    },
    {
      labelText: <span>Landline Number</span>,
      name: "landLineNumber",
      id: "landLineNumber",
      placeholder: "Landline Number",
      type: "text",
      defaultValue: "",
      disabled: "",
    },
    {
      labelText: "Email",
      name: "email",
      id: "email",
      placeholder: "Email",
      type: "text",
      defaultValue: "",
      disabled: "",
      required: "Enter Email",
    },
    {
      labelText: "Address",
      name: "address",
      id: "address",
      placeholder: "Address",
      type: "textarea",
      defaultValue: "",
      disabled: "",
      required: "Enter Address",
    },
    {
      labelText: "Logo",
      name: "logo",
      id: "logo",
      placeholder: "Logo",
      type: "text",
      defaultValue: "",
      disabled: "",
      required: "Enter Logo",
      tagNeeded: (
        <p>
          <p>
            <i
              onClick={() => setImgView(!imgView)}
              className="fa fa-eye cursor-pointer"
            ></i>
          </p>
        </p>
      ),
    },
  ];

  console.log("imgView", imgView);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await protectedCall(`api/organization/${state?.id}`);
        if (data.logo) {
          setLogoView(data.logo);
        }

        const formData = formDT?.map((elem) => {
          return { ...elem, defaultValue: data[elem?.id] };
        });
        setFormData(formData);
      } catch (error) {
        return error;
      }
    };
    fetchData();
  }, [state?.id]);
  const handleBack = async (e) => {
    e.preventDefault();
    navigate("/organization_list");
  };
  const handleCancel = async (e) => {
    e.preventDefault();
    methods.reset();
  };
  return (
    <>
      {" "}
      <Toast ref={toast} />
      {imgView && (
        <div className="fullscreen-overlay">
          <div
            className="close-icon cursor-pointer"
            onClick={() => setImgView(false)}
          >
            &times;
          </div>
          <img
            src={logoView}
            className="fullscreen-image w-1"
            alt="Full Screen View"
          />
        </div>
      )}
      <CustomFormWrapper
        formName="Edit Organization"
        formDT={newFormData}
        submitAction={async (e) => {
          try {
            const dataWithId = { id: state?.id, ...e };
            const response = await protectedCall(
              `api/organization/update`,
              dataWithId,
              "post"
            );
            console.log(response);

            // Show success toast
            toast.current.show({
              severity: "success",
              summary: "Success",
              detail: response.message || "Organization updated successfully",
            });

            setTimeout(() => {
              navigate("/organization_list");
            }, 2000); // 2000ms = 2 seconds
          } catch (error) {
            // Show error toast
            toast.current.show({
              severity: "error",
              summary: "Error",
              detail: `${error.response.data.message}`,
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
