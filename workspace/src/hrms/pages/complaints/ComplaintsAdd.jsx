import { useNavigate } from "react-router-dom";

import { useRef } from "react";
import { Toast } from "primereact/toast";
import { classNames } from "primereact/utils";
import PhoneInput from "react-phone-input-2";
import { protectedCall } from "../../../services/userService";
import CustomForm from "../../../components/form/customForm/CustomForm";
import { selectLoggedUser } from "../../../pages/login/loginSlice";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";

const formDT = [
  {
    labelText: (
      <span>
        Compliant Name<span className="text-red-600">*</span>
      </span>
    ),
    name: "compliantName",
    id: "compliantName",
    placeholder: "Enter Compliant Name",
    type: "text",
    defaultValue: "",
    disabled: "",
    required: "Enter Compliant Name",
  },
  {
    labelText: (
      <span>
        Complaint Description<span className="text-red-600">*</span>
      </span>
    ),
    name: "complaintsDescription",
    id: "complaintsDescription",
    placeholder: "Enter Complaint Description",
    type: "textarea",
    defaultValue: "",
    disabled: "",
    required: "Enter Complaint Description",
  },
];

const formStyles = {
  noOfFledsInARow: {
    sm: 12,
    md: 12,
    lg: 12,
    xl: 6,
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

export default function ComplaintsAdd() {
  const loggedUser = useSelector(selectLoggedUser);
  const loggedUserEmail = loggedUser.email; // Access the stored email
  const methods = useForm();

  const toast = useRef(null);
  const navigate = useNavigate();
  const handleSubmit = async (formData) => {
    try {
      const response = await protectedCall(
        "api/complaints/create",
        { ...formData, createdBy: loggedUserEmail },
        "post"
      );
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: `Complaints added successfully`,
      });
      setTimeout(() => {
        navigate("/complaints");
      }, 2000);
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: `Failed to add Complaint. Please try again.${error}}`,
      });
    }
  };

  const handleBack = async (e) => {
    e.preventDefault();
    navigate("/complaints");
  };
  const handleCancel = async (e) => {
    e.preventDefault();
    methods.reset();
  };
  return (
    <>
      {/* ToastContainer */}
      <div style={{}}>
        <Toast ref={toast} />

        <div className="bg-white p-4">
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

            // steps={{
            //   isStepperNeeded: true,
            //   noFieldsInAStep: 3,
            //   stepperLabel: [
            //     { label: "personal info" },
            //     { label: "other info" },
            //     { label: "other info" },
            //     { label: "other info" },
            //   ],
            // }}
          />
        </div>
        <div></div>
      </div>
    </>
  );
}
