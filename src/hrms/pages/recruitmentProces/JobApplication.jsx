import { useNavigate } from "react-router-dom";
import CustomForm from "../../../components/form/customForm/CustomForm";
import { protectedCall } from "../../../services/userService";

import { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import InfinityLoader from "../../../components/loader/Infinity";
import { useForm } from "react-hook-form";

const formStyles = {
  noOfFledsInARow: {
    sm: 12,
    md: 12,
    lg: 12,
    xl: 4,
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

export default function JobApplication() {
  const navigate = useNavigate();
  const [requirement, setRequirements] = useState([]);
  const [requirementDropDown, setRequirementsDropDown] = useState([]);
  const [loader, setLoader] = useState(false);
  const methods = useForm();

  useEffect(() => {
    const fetchRequirement = async () => {
      try {
        const data = await protectedCall("api/requirement/all/positions");
        setRequirements(
          data.map((i) => ({ id: i.id, designation: i.designation }))
        );
      } catch (error) {
        // console.log(error);
      }
    };
    fetchRequirement();
  }, []);

  useEffect(() => {
    setRequirementsDropDown(
      requirement.map((i) => ({ id: i.id, designation: i.designation }))
    );
  }, [requirement]);

  const ageValidation = (value) => {
    if (!value) return "Date of Birth is required"; // If no date is provided

    const selectedDate = new Date(value);
    const today = new Date();
    let age = today.getFullYear() - selectedDate.getFullYear(); // Use 'let' here to allow reassignment
    const month = today.getMonth() - selectedDate.getMonth();

    if (
      month < 0 ||
      (month === 0 && today.getDate() < selectedDate.getDate())
    ) {
      age--; // Adjust age if birthday hasn't occurred this year
    }

    if (age < 18) {
      return "You must be 18 years or older"; // Error message if age < 18
    }

    return true; // Valid if age is 18 or older
  };

  const validate10Digits = (value) => {
    console.log(value, "value");

    if (!value) return "No number entered.";
    const numberPattern = /^\d{12}$/;
    return numberPattern.test(value)
      ? true
      : "Number must be exactly 10 digits.";
  };

  const formDT = [
    {
      labelText: (
        <span>
          First Name<span className="text-red-600">*</span>
        </span>
      ),
      name: "firstName",
      id: "firstName",
      placeholder: "Enter First Name",
      type: "text",
      defaultValue: "",
      disabled: "",
      required: "Enter First Name", // Validation message
    },
    {
      labelText: (
        <span>
          Last Name<span className="text-red-600">*</span>
        </span>
      ),
      name: "lastName",
      id: "lastName",
      placeholder: "Enter Last Name",
      type: "text",
      defaultValue: "",
      disabled: "",
      required: "Enter Last Name", // Validation message
    },
    {
      labelText: (
        <span>
          Personal Email<span className="text-red-600">*</span>
        </span>
      ),
      name: "personalEmail",
      id: "personalEmail",
      placeholder: "Enter Email",
      type: "text", // Correct type for email
      defaultValue: "",
      disabled: "",
      required: "Enter Email", // Validation message
    },
    {
      labelText: (
        <span>
          Mobile Number<span className="text-red-600">*</span>
        </span>
      ),
      name: "mobileNumber",
      id: "mobileNumber",
      placeholder: "Enter Mobile Number",
      type: "phone", // Use 'tel' for phone numbers
      defaultValue: "",
      disabled: "",
      required: "Enter Mobile Number",
      validation: { validate10Digits },
    },
    {
      labelText: (
        <span>
          Gender<span className="text-red-600">*</span>
        </span>
      ),
      name: "gender",
      id: "gender",
      placeholder: "Enter Gender",
      type: "radio",
      defaultValue: "",
      disabled: "",
      options: ["Male", "Female"],
      required: "Select Gender", // Validation message
    },
    {
      labelText: (
        <span>
          Date of Birth<span className="text-red-600">*</span>
        </span>
      ),
      name: "dateOfBirth",
      id: "dateOfBirth",
      placeholder: "Select Date of Birth",
      type: "date", // Use 'date' type for date inputs
      defaultValue: "",
      disabled: "",
      required: "Enter Date of Birth", // Validation message
      validation: { ageValidation },
    },
    {
      labelText: (
        <span>
          Address<span className="text-red-600">*</span>
        </span>
      ),
      name: "address",
      id: "address",
      placeholder: "Enter Address",
      type: "textarea", // Textarea for multiline inputs
      defaultValue: "",
      disabled: "",
      required: "Enter Address", // Validation message
    },
    {
      labelText: (
        <span>
          City<span className="text-red-600">*</span>
        </span>
      ),
      name: "city",
      id: "city",
      placeholder: "Enter City",
      type: "text",
      defaultValue: "",
      disabled: "",
      required: "Enter City", // Validation message
    },
    {
      labelText: (
        <span>
          State<span className="text-red-600">*</span>
        </span>
      ),
      name: "state",
      id: "state",
      placeholder: "-Select-",
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
      required: "Enter State", // Validation message
    },
    {
      labelText: (
        <span>
          Postal Code<span className="text-red-600">*</span>
        </span>
      ),
      name: "postalCode",
      id: "postalCode",
      placeholder: "Enter Postal Code",
      type: "text",
      defaultValue: "",
      disabled: "",
      required: "Enter Postal Code", // Validation message
    },
    {
      labelText: (
        <span>
          Country<span className="text-red-600">*</span>
        </span>
      ),
      name: "country",
      id: "country",
      placeholder: "Enter Country",
      type: "text",
      defaultValue: "",
      disabled: "",
      required: "Enter Country", // Validation message
    },
    {
      labelText: (
        <span>
          Work Experience<span className="text-red-600">*</span>
        </span>
      ),
      name: "workExperience",
      id: "workExperience",
      placeholder: "Enter Work Experience",
      type: "text",
      defaultValue: "",
      disabled: "",
      required: "Enter Work Experience", // Validation message
    },
    {
      labelText: (
        <span>
          Position Applying For<span className="text-red-600">*</span>
        </span>
      ),
      name: "applyingFor",
      id: "applyingFor",
      placeholder: "Select Position",
      type: "select",
      options: requirementDropDown.map((i) => i.designation),
      defaultValue: "",
      disabled: "",
      required: "Select Position",
    },
    {
      labelText: (
        <span>
          Resume<span className="text-red-600">*</span>
        </span>
      ),
      name: "resume",
      id: "resume",
      placeholder: "Upload Resume",
      type: "file", // For file uploads
      defaultValue: "",
      disabled: "",
      required: "Upload Resume", // Validation message
    },
  ];

  const toast = useRef(null);

  const handleSubmit = async (formData) => {
    setLoader(true);
    const selectedPosition = formData.applyingFor; // This holds the designation
    const selectedPositionId = requirement.find(
      (position) => position.designation === selectedPosition
    )?.id; // Get the ID for the selected designation

    // Ensure the selected position ID is valid
    if (!selectedPositionId) {
      console.error("Selected position ID is null or undefined");
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Please select a valid position.",
      });
      return; // Prevent submission
    }

    const fileList = formData.resume; // Assuming formData.resume is a FileList

    // Create the payload to send to the API
    const payload = {
      ...formData, // Spread the existing form data
      requirementId: selectedPositionId, // Include the selected position ID
      resume: fileList[0].name, // Assuming you want to send the filename of the resume
    };

    try {
      const response = await protectedCall(
        "api/candidate-applications/create",
        payload, // Send the complete payload
        "post"
      );

      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: `Application added successfully: ${response?.data?.firstName}`,
      });

      setTimeout(() => {
        navigate("/applied_candidates");
      }, 1000);
    } catch (error) {
      console.error("Error submitting the form:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: `Failed to apply.
        Error: ${error.response.data.message}`,
      });
    } finally {
      setLoader(false);
    }
  };
  const handleBack = async (e) => {
    e.preventDefault();
    navigate("/applied_candidates");
  };
  const handleCancel = async (e) => {
    e.preventDefault();
    methods.reset();
  };

  return (
    <>
      {loader && <InfinityLoader />}
      <div>
        <Toast ref={toast} />

        <div className="bg-white p-4">
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
          />
        </div>
      </div>
    </>
  );
}
