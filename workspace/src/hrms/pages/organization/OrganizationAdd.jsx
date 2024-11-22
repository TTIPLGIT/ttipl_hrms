import { useNavigate } from "react-router-dom";
import CustomForm from "../../../components/form/customForm/CustomForm";
import { protectedCall } from "../../../services/userService";

import { useRef, useState } from "react";
import { Toast } from "primereact/toast";
import InfinityLoader from "../../../components/loader/Infinity";
import { useForm } from "react-hook-form";

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

const validation80kb = (files) => {
  if (!files || !files.length) return "No file selected.";
  if (files[0].size > 80 * 1024) return "File size must be less than 80kb.";
  return true;
};

const validate11Digits = (value) => {
  console.log(value, "value");

  if (!value) return "No number entered.";
  const numberPattern = /^\d{11}$/;
  return numberPattern.test(value) ? true : "Number must be exactly 11 digits.";
};

const validate10Digits = (value) => {
  console.log(value, "value");

  if (!value) return "No number entered.";
  const numberPattern = /^\d{12}$/;
  return numberPattern.test(value) ? true : "Number must be exactly 10 digits.";
};

export default function OrganizationAdd() {
  const [loader, setLoader] = useState(false);

  const formDT = [
    {
      labelText: (
        <span>
          Organization Name<span className="text-red-600">*</span>
        </span>
      ),
      name: "name",
      id: "name",
      placeholder: "Enter Organization Name",
      type: "text",
      defaultValue: "",
      disabled: "",
      required: "Enter Organization Name ",
    },
    {
      labelText: (
        <span>
          Company Email<span className="text-red-600">*</span>
        </span>
      ),
      name: "email",
      id: "email",
      placeholder: "Email",
      type: "text",
      defaultValue: "",
      disabled: "",
      required: "Enter Email",
    },
    {
      labelText: (
        <span>
          Phone Number<span className="text-red-600">*</span>
        </span>
      ),
      name: "phoneNumber",
      id: "phoneNumber",
      placeholder: "Phone Number",
      type: "phone",
      defaultValue: "",
      disabled: "",
      required: "Enter Phone Number",
      validation: { validate10Digits },
    },
    {
      labelText: (
        <span>
          Landline Number<span className="text-red-600">*</span>
        </span>
      ),
      name: "landLineNumber",
      id: "landLineNumber",
      placeholder: "Landline Number",
      type: "number",
      defaultValue: "",
      disabled: "",
      required: "Enter Landline Number",
      validation: { validate11Digits },
    },
    {
      labelText: (
        <span>
          Address<span className="text-red-600">*</span>
        </span>
      ),
      name: "address",
      id: "address",
      placeholder: "Address",
      type: "textarea",
      defaultValue: "",
      disabled: "",
      required: "Enter Address",
    },
    {
      labelText: (
        <span>
          State<span className="text-red-600">*</span>
        </span>
      ),
      name: "district",
      id: "district",
      placeholder: "Select State",
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
      required: "Select Organization State",
    },
    {
      labelText: (
        <span>
          Logo<span className="text-red-600">*</span>
        </span>
      ),
      name: "logo",
      id: "logo",
      placeholder: "Logo",
      type: "file",
      defaultValue: "",
      disabled: "",
      required: "Upload Logo",
      validation: { validation80kb },

      tagNeeded: (
        <p className="text-gray-600 text-xs  font-bold my-0">
          Please upload a photo in JPEG or PNG format with a maximum file size
          of 80KB.
        </p>
      ),
    },
  ];
  const methods = useForm();

  const toast = useRef(null);
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    setLoader(true);

    const profileImage = formData.logo; // Get the FileList from formData.logo

    // Check if there is a logo file
    if (profileImage && profileImage.length > 0) {
      const file = profileImage[0]; // Get the first file
      const reader = new FileReader();

      // Return a Promise to handle async reading of file
      const readFile = () =>
        new Promise((resolve, reject) => {
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file); // Read file as base64 string
        });

      try {
        const base64Image = await readFile(); // Wait for the file to be read
        formData.logo = base64Image; // Replace logo with base64 string in formData

        const response = await protectedCall(
          "api/organization/create",
          formData,
          "post"
        );

        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: `Organization added successfully: ${response.data.organizationName}`,
        });

        setTimeout(() => {
          navigate("/organization_list");
        }, 2000); // 2000ms = 2 seconds
      } catch (error) {
        setLoader(false);

        console.error(
          "Error reading the logo file or submitting the form:",
          error
        );
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: `${error.response.data.message}`,
        });
      }
    } else {
      console.log("No logo file found, proceeding without logo...");
      try {
        const response = await protectedCall(
          "api/organization/create",
          formData,
          "post"
        );

        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: `Organization added successfully`,
        });

        setTimeout(() => {
          navigate("/organization_list");
        }, 2000); // 2000ms = 2 seconds
      } catch (error) {
        console.error("Error submitting the form:", error);
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: `${error.response.data.message}`,
        });
      } finally {
        setLoader(false);
      }
    }
  };
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
      <div className="grid w-full p-2">
        <Toast ref={toast} />
        {loader && <InfinityLoader />}
        <div className="bg-white w-full p-6">
          <CustomForm
            formDT={formDT}
            formStyles={formStyles}
            submitAction={handleSubmit}
            isSection={true}
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

        <div></div>
      </div>
    </>
  );
}
