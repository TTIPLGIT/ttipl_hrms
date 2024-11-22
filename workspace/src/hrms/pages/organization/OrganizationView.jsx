import { useLocation } from "react-router-dom";
import CustomFormWrapper from "../../../components/form/customForm/CustomFormWrapper";
import { protectedCall } from "../../../services/userService";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { validate } from "uuid";

// Validation function for landline numbers
const validateLandline = (landlineNumber) => {
  // Allow formats like '1234-5678901' or '5678901'
  const landlinePattern = /^(\d{3,5}-?\d{5,8})$/;
  return landlinePattern.test(landlineNumber);
};

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
    disabled: "",
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
    validation: { validateLandline },
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
  },
];

export default function OrganizationView() {
  const { state } = useLocation();
  const [newFormData, setFormData] = useState();
  const methods = useForm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await protectedCall(`api/organization/${state?.id}`);
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
      formName="View Organization"
      formDT={newFormData}
      submitButton={false}
      methods={methods}
    />
  );
}
