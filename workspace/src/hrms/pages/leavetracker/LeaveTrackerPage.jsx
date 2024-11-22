import { protectedCall } from "../../../services/userService";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import CustomForm from "../../../components/form/customForm/CustomForm";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
export default function LeaveTrackerPage() {
  const [department, setDepartment] = useState([]);
  const [designation, setDesignation] = useState([]);
  const methods = useForm();

  const toast = useRef(null);
  const navigate = useNavigate();

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

  const handleSubmit = async (formData) => {
    // Convert applicableFor to boolean
    const applicableForValue = formData.applicableFor === "All Employees";

    // Convert rollOver and rollOverCount to the expected types
    const rollOverValue = formData.rollOver ? true : false; // Ensure it's a boolean
    const rollOverCountValue = Number(formData.rollOverCount); // Convert to number

    // Build the payload to send to the API
    const payload = {
      ...formData,
      applicableForAllEmployees: applicableForValue,
      rollOver: rollOverValue,
      rollOverCount: rollOverCountValue,
      leaveCount: Number(formData.leaveCount),
      isActive: true,
    };

    console.log("payload", payload);

    try {
      const res = await protectedCall("api/master/create", payload, "post");
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: `Leave Type added successfully`,
      });
      setTimeout(() => {
        navigate("/leave_type"); // Reload the page
      }, 1000); // Optional: Delay the reload for 1 second to let the toast message display
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: `Failed to Add Leave Type. Please try again. ${error}`,
      });
    }
  };

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
          gridTemplateColumns: "40% 60%",
          height: "80vh",
          overflow: "scroll",
          backgroundColor: "white",
          padding: "2rem",
        }}
      >
        <Toast ref={toast} />

        <div>
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
            isSection={true}
          />
        </div>
        <div></div>
      </div>
    </>
  );
}
