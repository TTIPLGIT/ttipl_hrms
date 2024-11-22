import { useLocation } from "react-router-dom";
import CustomFormWrapper from "../../../components/form/customForm/CustomFormWrapper";
import { protectedCall } from "../../../services/userService";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const formStyles = {
  noOfFledsInARow: {
    sm: 12,
    md: 12,
    lg: 12,
    xl: 12,
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

const formDT = [
  {
    labelText: (
      <span>
        Name<span className="text-red-600">*</span>
      </span>
    ),
    name: "name",
    id: "name",
    type: "text",
    defaultValue: "",
    disabled: "",
    placeholder: "Enter Leave Name",
    required: "Enter Leave Name",
    section: "",
  },
  {
    labelText: <span>Type</span>,
    name: "type",
    id: "type",
    type: "select",
    options: ["paid", "Unpaid"],
    defaultValue: "",
    disabled: "",
    section: "",
  },
  {
    labelText: (
      <span>
        Applicable for<span className="text-red-600">*</span>
      </span>
    ),
    name: "applicableFor",
    id: "applicableFor",
    type: "radio",
    options: ["All Employees", "Specific Employees"],
    defaultValue: "",
    disabled: "",
    section: "",
  },
  {
    labelText: <span>Department</span>,
    name: "department",
    id: "department",
    type: "select",
    // options: department.map((i) => i.department),
    defaultValue: "",
    disabled: "",
    conditionRequired: true,
    condition: "equal",
    conditionInputName: "applicableFor",
    compareValue: "Specific Employees",
    section: "",
  },
  {
    labelText: <span>Designation</span>,
    name: "designation",
    id: "designation",
    type: "select",
    // options: designation.map((i) => i.designation),
    defaultValue: "",
    disabled: "",
    conditionRequired: true,
    condition: "equal",
    conditionInputName: "applicableFor",
    compareValue: "Specific Employees",
    section: "",
  },
  {
    labelText: <span>Location</span>,
    name: "location",
    id: "location",
    type: "select",
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
    defaultValue: "",
    disabled: "",
    conditionRequired: true,
    condition: "equal",
    conditionInputName: "applicableFor",
    compareValue: "Specific Employees",
    section: "",
  },
  {
    labelText: (
      <span>
        Leave Cycle Period<span className="text-red-600">*</span>
      </span>
    ),
    name: "leaveCyclePeriod",
    id: "leaveCyclePeriod",
    type: "radio",
    options: ["Yearly(Jan to Dec)", "Monthly"],
    defaultValue: "",
    disabled: "",
    required: "Select Leave Cycle Period",
    section: "Leave Policy",
  },
  {
    labelText: (
      <span>
        Leave Count<span className="text-red-600">*</span>
      </span>
    ),
    name: "leaveCount",
    id: "leaveCount",
    type: "number",
    defaultValue: "",
    disabled: "",
    required: "Select Leave Count",
    section: "Leave Policy",
  },
  {
    labelText: " ",
    name: "rollOver",
    id: "rollOver",
    type: "checkbox",
    options: ["Enable Roll Over / Carry Forward"],
    disabled: "",
    section: "Roll Over / Carry Forward Settings",
  },
  {
    labelText: (
      <span>
        Maximum Roll Over Accumulation Count
        <span className="text-red-600">*</span>
      </span>
    ),
    name: "rollOverCount",
    id: "rollOverCount",
    type: "number",
    defaultValue: "",
    disabled: "",
    section: "Roll Over / Carry Forward Settings",
  },
];
export default function LeaveTypeView() {
  const { state } = useLocation();
  const [newFormData, setFormData] = useState();
  const methods = useForm();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await protectedCall(`api/master/${state?.id}`);
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
    <>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "60%",
          height: "100vh",
          overflow: "scroll",
          backgroundColor: "white",
          padding: "2rem",
        }}
      >
        <div className="">
          <CustomFormWrapper
            formName="View Leave Type"
            formDT={newFormData}
            formStyles={formStyles}
            submitButton={false}
            methods={methods}
          />
        </div>
        <div className=""></div>
      </div>
    </>
  );
}
