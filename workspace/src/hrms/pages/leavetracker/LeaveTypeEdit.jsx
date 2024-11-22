import { useLocation, useNavigate } from "react-router-dom";

import { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { protectedCall } from "../../../services/userService";
import CustomFormWrapper from "../../../components/form/customForm/CustomFormWrapper";
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

export default function LeaveTypeEdit() {
  const [department, setDepartment] = useState([]);
  const [designation, setDesignation] = useState([]);
  const toast = useRef(null);
  const navigate = useNavigate();
  const methods = useForm();

  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        const departmentData = await protectedCall(
          "api/requirement/department"
        );
        const extractDepartment = departmentData.map((i) => ({
          department: i.department,
        }));
        setDepartment(extractDepartment);
      } catch (error) {
        console.log(error);
      }
    };
    fetchDepartment();
  }, []);
  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        const designationData = await protectedCall(
          "api/requirement/designation"
        );
        const extractDesignation = designationData.map((i) => ({
          designation: i.designation,
        }));
        setDesignation(extractDesignation);
      } catch (error) {
        console.log(error);
      }
    };
    fetchDepartment();
  }, []);
  const { state } = useLocation();
  const [newFormData, setFormData] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await protectedCall(`api/master/${state?.id}`);
        if (department?.length && designation?.length) {
          const formData = formDT?.map((elem) => {
            return { ...elem, defaultValue: data[elem?.id] };
          });
          setFormData(formData);
        }
      } catch (error) {
        return error;
      }
    };
    fetchData();
  }, [state?.id, department?.length, designation?.length]);

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
      options: department.map((i) => i.department),
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
      options: designation.map((i) => i.designation),
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

  const handleBack = async (e) => {
    e.preventDefault();
    navigate("/leave_type");
  };
  const handleCancel = async (e) => {
    e.preventDefault();
    methods.reset();
  };

  return (
    <>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "60%",
          height: "100vh",
          overflow: "scroll",
          backgroundColor: "white",
          padding: "1rem",
        }}
      >
        <Toast ref={toast} />

        <div className="">
          <CustomFormWrapper
            formName="Edit Leave Type"
            formDT={newFormData}
            formStyles={formStyles}
            submitAction={async (e) => {
              console.log("dataWithId", e);

              try {
                const dataWithId = {
                  id: state?.id,
                  ...e,
                  rollOverCount: Number(e.rollOverCount) || 0,
                  isActive: true,
                };
                const response = await protectedCall(
                  `api/master/update`,
                  dataWithId,
                  "post"
                );
                toast.current.show({
                  severity: "success",
                  summary: "Success",
                  detail: response.message || "Leave Type updated successfully",
                });

                setTimeout(() => {
                  navigate("/leave_type");
                }, 2000);
              } catch (error) {
                toast.current.show({
                  severity: "error",
                  summary: "Error",
                  detail: "Failed to update Leave Type. Please try again.",
                });
                console.log(error);
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
            submitButton={true}
          />
        </div>
        <div className=""></div>
      </div>
    </>
  );
}
