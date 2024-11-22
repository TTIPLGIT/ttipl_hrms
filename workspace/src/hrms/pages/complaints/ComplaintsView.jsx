import { useLocation } from "react-router-dom";

import { useEffect, useState } from "react";
import { protectedCall } from "../../../services/userService";
import CustomFormWrapper from "../../../components/form/customForm/CustomFormWrapper";
import { useForm } from "react-hook-form";

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

export default function ComplaintsView() {
  const { state } = useLocation();
  const [newFormData, setFormData] = useState();
  const methods = useForm();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await protectedCall(`api/complaints/${state?.id}`);
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
      formName="View Team Complaints"
      formDT={newFormData}
      submitButton={false}
      methods={methods}
    />
  );
}
