import { useLocation, useNavigate } from "react-router-dom";

import { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { protectedCall } from "../../../services/userService";
import CustomFormWrapper from "../../../components/form/customForm/CustomFormWrapper";
import { useSelector } from "react-redux";
import { selectLoggedUser } from "../../../pages/login/loginSlice";
import { useForm } from "react-hook-form";
export default function ComplaintsEdit() {
  const loggedUser = useSelector(selectLoggedUser);
  const loggedUserEmail = loggedUser.email; // Access the stored email
  const formDT = [
    {
      labelText: "Compliant Name",
      name: "compliantName",
      id: "compliantName",
      placeholder: "Enter Compliant Name",
      type: "text",
      defaultValue: "",
      disabled: "",
      required: "Enter Compliant Name",
    },
    {
      labelText: "Complaint Description",
      name: "complaintsDescription",
      id: "complaintsDescription",
      placeholder: "Enter Complaint Description",
      type: "textarea",
      defaultValue: "",
      disabled: "",
      required: "Enter Complaint Description",
    },
    {
      labelText: "change status",
      name: "status",
      id: "status",
      placeholder: "select",
      type: "select",
      options: ["open", "in-progress", "closed"],
      required: "Enter Complaint Description",
    },
  ];
  const toast = useRef(null);

  const navigate = useNavigate();
  const { state } = useLocation();
  const [newFormData, setFormData] = useState();
  const methods = useForm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await protectedCall(`api/complaints/${state?.id}`);
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
    navigate("/complaints/team_complaints");
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
        formName="Edit Team complaints"
        formDT={newFormData}
        submitAction={async (e) => {
          try {
            const dataWithId = { id: state?.id, ...e };
            const response = await protectedCall(
              `api/complaints/update`,
              { ...dataWithId, closedBy: loggedUserEmail },
              "post"
            );

            // Show success toast
            toast.current.show({
              severity: "success",
              summary: "Success",
              detail: response.message || "Complaint updated successfully",
            });

            setTimeout(() => {
              navigate("/complaints/team_complaints");
            }, 2000); // 2000ms = 2 seconds
          } catch (error) {
            // Show error toast
            toast.current.show({
              severity: "error",
              summary: "Error",
              detail: "Failed to update status. Please try again.",
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
