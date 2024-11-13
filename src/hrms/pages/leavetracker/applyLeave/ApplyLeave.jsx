import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import { protectedCall } from "../../../../services/userService";
import CustomForm from "../../../../components/form/customForm/CustomForm";
import { useSelector } from "react-redux";
import { selectLoggedUser } from "../../../../pages/login/loginSlice";
import { useForm, useWatch } from "react-hook-form";
import { differenceInCalendarDays } from "date-fns";
import InfinityLoader from "../../../../components/loader/Infinity";
import styles from "./styles.module.css";
import { useNavigate } from "react-router-dom";
export default function ApplyLeave() {
  const navigate = useNavigate();
  const methods = useForm();

  const [loader, setLoader] = useState(false);
  const [leaveType, setLeaveType] = useState([]);
  const toast = useRef(null);
  const [setIsTrue, setSetIsTrue] = useState(false);
  const [halfDayDisable, setHalfDayDisable] = useState(false);
  const [disableSubmit, setDisableSubmit] = useState(false);

  const loggedUser = useSelector(selectLoggedUser);

  const loggedEmpId = loggedUser.employeeId;
  const loggedEmployeeId = loggedUser.empId;

  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        const departmentData = await protectedCall("api/master");
        console.log("API Response:", departmentData); // Log the response

        const extractDepartment = departmentData.map((i) => ({
          leaveType: i.name,
          id: i.id,
          leaveCount: i.leaveCount, // Correctly map leaveCount
        }));
        setLeaveType(extractDepartment);
      } catch (error) {
        console.log(error);
      }
    };
    fetchDepartment();
  }, []);

  const checkLeaveBalance = async (leaveTypeId) => {
    try {
      const response = await protectedCall(
        "api/leave-request/findOneByLeaveType", // Ensure this API is set to handle the masterId instead of leaveType
        {
          employeeId: loggedEmpId,
          masterId: leaveTypeId, // Send the ID instead
        },
        "post"
      );
      // Check if balanceCount is 0 or less
      if (response.balanceCount <= 1) {
        setSetIsTrue(true);
        return "No leave available"; // Return message if no leave is available
      }

      if (response.balanceCount <= 0) {
        setHalfDayDisable(true);
        return "No leave available"; // Return message if no leave is available
      }

      return response.balanceCount; // Return the balance count from the response
    } catch (error) {
      console.log("Error fetching leave balance:", error);

      try {
        const leaveCountResponse = await protectedCall(
          "api/master/count", // Adjust the API endpoint accordingly
          { id: leaveTypeId }, // Use leaveTypeId to fetch count based on ID
          "post"
        );
        console.log("leaveTypeId", leaveTypeId);

        const leaveCount =
          leaveCountResponse.length > 0 ? leaveCountResponse[0].leaveCount : 0;

        return leaveCount; // Return leave count from the master service
      } catch (leaveCountError) {
        console.error("Error fetching leave count:", leaveCountError);
        return 0; // Return 0 if there was an error fetching the leave count
      }
    }
  };

  const handleSubmit = async (formData) => {
    setLoader(true);
    const selectedLeaveType = leaveType.find(
      (type) => type.leaveType === formData.leaveType
    );
    const payload = {
      ...formData,
      employeeId: loggedEmpId,
      masterId: selectedLeaveType?.id,
      isActive: true,
      appliedLeaveCount: 1,
      balanceCount: 1,
    };
    console.log("payload", payload);

    try {
      const res = await protectedCall(
        "api/leave-request/apply",
        payload,
        "post"
      );
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: `Leave Type added successfully`,
      });
      setTimeout(() => {
        navigate("/requested_leave");
      }, 1000);
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: `Failed to Add Leave Type. Please try again. ${error.response.data.message}`,
      });
    } finally {
      setLoader(false);
    }
  };

  const startDateValidation = (value) => {
    if (!value) return "Date is required"; // If no date is provided
    const selectedDate = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set today's time to midnight for accurate comparison
    if (selectedDate <= today) {
      return "Date must be in the future"; // Error message if the date is not in the future
    }
    return true; // Valid if the date is in the future
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
      fontWeight: "600",
      fontSize: "",
    },
  };

  const [leaveBalance, setLeaveBalance] = useState(null);

  const EmployeeADD = ({ control }) => {
    const fieldValue = useWatch({
      control,
      name: "leaveType",
    });

    useEffect(() => {
      const fetchLeaveBalance = async () => {
        if (fieldValue) {
          // Find the selected leave type's ID
          const selectedLeaveType = leaveType.find(
            (type) => type.leaveType === fieldValue
          );

          // Call checkLeaveBalance with the selected leave type's ID
          if (selectedLeaveType) {
            const balance = await checkLeaveBalance(selectedLeaveType.id); // Use the ID
            setLeaveBalance(balance); // Default to 6 if balance is null
          }
        }
      };

      fetchLeaveBalance();
    }, [fieldValue]);

    return (
      <p>
        Available Leave -{" "}
        <span className="text-green-600">{leaveBalance ?? ""}</span> Days
      </p>
    );
  };

  const TotalDaysUpdate = ({ control }) => {
    const [totalDays, setTotalDays] = useState(0); // State for total days
    const [hasShownWarning, setHasShownWarning] = useState(false);

    const startDate = useWatch({ control, name: "startDate" });
    const endDate = useWatch({ control, name: "endDate" });
    useEffect(() => {
      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const daysDifference = differenceInCalendarDays(end, start) + 1; // Add 1 to include both start and end date
        setTotalDays(daysDifference > 0 ? daysDifference : 0);

        // Check if total days exceed available leave balance
        if (leaveBalance && daysDifference > leaveBalance) {
          setDisableSubmit(true);
        } else {
          setDisableSubmit(false);
        }
      }
    }, [startDate, endDate]);
    return (
      <p>
        Applied Leave for -{" "}
        <span
          className={`text-${
            totalDays > leaveBalance ? "red-600" : "green-600"
          }`}
        >
          {totalDays ?? " "}
        </span>
        <span> Days</span>
        <br></br>
        {totalDays > leaveBalance && (
          <span className="text-sm font-bold text-red-600">
            No available leave please apply leave on other dates
          </span>
        )}
      </p>
    );
  };

  const formDT = [
    {
      labelText: (
        <span>
          Employee ID<span className="text-red-600">*</span>
        </span>
      ),
      name: "employeeId",
      id: "employeeId",
      type: "text",
      defaultValue: loggedEmployeeId,
      disabled: "true",
      section: "",
    },
    {
      labelText: (
        <span>
          Type<span className="text-red-600">*</span>
        </span>
      ),
      name: "type",
      id: "type",
      type: "radio",
      options: ["Full Day", "Half Day"],
      defaultValue: "",
      disabled: "",
      section: "",
    },
    {
      labelText: (
        <span>
          Leave Type<span className="text-red-600">*</span>
        </span>
      ),
      name: "leaveType",
      id: "leaveType",
      type: "select",
      options: leaveType.map((i) => i.leaveType),
      defaultValue: "",
      disabled: "",
      section: "",
      required: "select Leave type",

      tagNeeded: <EmployeeADD />,
    },

    {
      labelText: (
        <span>
          FN / AN<span className="text-red-600">*</span>
        </span>
      ),
      name: "fnan",
      id: "fnan",
      type: "select",
      options: ["Forenoon", "Afternoon"],
      defaultValue: "",
      disabled: "",
      section: "",
      required: "select FN / AN",
      conditionRequired: true,
      condition: "equal",
      conditionInputName: "type",
      compareValue: "Half Day",
    },
    {
      labelText: <span>Compensate For</span>,
      name: "compensateDate",
      id: "compensateDate",
      type: "date",
      defaultValue: "",
      disabled: "",
      section: "",
    },
    {
      labelText: (
        <span>
          Date<span className="text-red-600">*</span>
        </span>
      ),
      name: "date",
      id: "date",
      type: "date",
      defaultValue: "",
      disabled: setIsTrue,
      section: "",
      conditionRequired: true,
      condition: "equal",
      conditionInputName: "type",
      required: "select Date",
      compareValue: "Half Day",
    },
    {
      labelText: (
        <span>
          From<span className="text-red-600">*</span>
        </span>
      ),
      name: "startDate",
      id: "startDate",
      type: "date",
      defaultValue: "",
      disabled: setIsTrue,
      section: "",
      conditionRequired: true,
      condition: "equal",
      conditionInputName: "type",
      compareValue: "Full Day",
      validation: { startDateValidation },
      required: "select From date",
    },
    {
      labelText: (
        <span>
          To<span className="text-red-600">*</span>
        </span>
      ),
      name: "endDate",
      id: "endDate",
      type: "date",
      defaultValue: "",
      disabled: setIsTrue,
      conditionRequired: true,
      condition: "equal",
      conditionInputName: "type",
      compareValue: "Full Day",
      section: "",
      required: "select End date",
      validation: { startDateValidation },
      tagNeeded: <TotalDaysUpdate />,
    },

    {
      labelText: <span>Reason for Leave</span>,
      name: "reason",
      id: "reason",
      type: "textarea",
      defaultValue: "",
      disabled: "",
      section: "",
    },
  ];

  // const handleBack = async (e) => {
  //   e.preventDefault();
  //   navigate("/asset_list");
  // };
  const handleCancel = async (e) => {
    e.preventDefault();
    methods.reset();
  };

  return (
    <>
      {loader && <InfinityLoader />}
      <div className="w-full lg:w-6">
        <Toast ref={toast} />

        <div className={`${styles.form} bg-white p-4`}>
          <CustomForm
            formDT={formDT}
            formStyles={formStyles}
            submitAction={handleSubmit}
            extraButtons={[
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
            isSection={true}
            methods={methods}
          />
        </div>
        <div></div>
      </div>
    </>
  );
}
