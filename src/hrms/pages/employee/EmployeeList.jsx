import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Table from "../../../components/table/Table";
import { protectedCall, unProtectedCall } from "../../../services/userService";
import { FileUpload } from "primereact/fileupload";
import Papa from "papaparse";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import InfinityLoader from "../../../components/loader/Infinity";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";

const tableName = "Employee list";

const formStyles = {
  noOfFledsInARow: {
    sm: 12,
    md: 6,
    lg: 3,
    xl: 3,
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

const tableStyle = {
  addBtn: {
    wrapperBg: "",
    wrapperBorder: "",
    wrapperBorderRadius: "",
    btnBg: "",
    btnText: "",
    btnFontSize: "",
    btnFontWeight: "",
    btnBorder: "",
    btnBorderRadius: "",
  },
  pagination: {
    bg: "",
    fontSize: "",
    fontWeight: "",
    alignment: "end",
  },
  tableHeader: {
    text: " ",
    bg: "",
    iconBorder: "",
    fontSize: "",
    fontWeight: "",
  },
  tableBody: {
    text: "",
    bg: "",
    fontSize: "",
    fontWeight: "",
  },
};

export default function EmployeeList() {
  const [loader, setLoader] = useState(false);
  const [csvData, setCsvData] = useState([]);
  const [visible, setVisible] = useState(false);
  const [products, setProducts] = useState([]); // Initialize as empty array
  const navigate = useNavigate();
  const [row, setRow] = useState({});
  const [isMenuOpen, setMenuOpen] = useState(false);
  const toast = useRef(null); // Reference for Toast component
  const [definedHead, setDefined] = useState({});
  const toastRef = useRef(null);

  const head = Object.keys(
    definedHead
      ? {
          ...definedHead,
          action: "action",
        }
      : {}
    // products.length ? { ...products[0], action: "action" } : {}
  ).filter((elem) => elem !== "id" && elem !== "logo");

  const actions = [
    {
      label: "Edit",
      icon: "pi pi-pen-to-square",
      command: () => {
        navigate("/employee_list/edit", { state: { id: row?.id } });
      },
    },
    {
      label: "View",
      icon: "pi pi-eye",
      command: () => {
        navigate("/employee_list/view", { state: { id: row?.id } });
      },
    },
    {
      label: "Delete",
      icon: "pi pi-trash",
      command: () => {
        confirmDialog({
          message: "Are you sure you want to delete this employee?",
          header: "Confirmation",
          icon: "pi pi-exclamation-triangle",
          accept: async () => {
            try {
              await protectedCall(
                "api/employee/delete",
                { id: row?.id },
                "post"
              );
              // Refresh the products after deletion
              const data = await protectedCall("api/employee");
              setProducts(data.length > 0 ? data : []);
              toast.current.show({
                severity: "success",
                summary: "Successful",
                detail: "Employee deleted successfully.",
              });
            } catch (error) {
              toast.current.show({
                severity: "error",
                summary: "Error",
                detail: "Failed to delete Employee.",
              });
            }
            setMenuOpen(false);
          },
          reject: () => {
            toast.current.show({
              severity: "info",
              summary: "Cancelled",
              detail: "Delete operation cancelled.",
            });
          },
        });
      },
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoader(true); // Start loader

      const data = await protectedCall("api/employee");
      setDefined(data[0]);

      setProducts(data.length > 0 ? data : []);
      setLoader(false); // Stop loader
    };

    fetchData();
  }, []);
  const myUploader = async (e) => {
    setLoader(true); // Show loader

    const files = e.files;

    if (files && files.length > 0) {
      const file = files[0];

      // Parse the CSV file
      Papa.parse(file, {
        header: true, // Use header row for keys
        skipEmptyLines: true, // Skip empty lines
        complete: async (results) => {
          // Filter out rows where firstName is empty
          const filteredData = results.data.filter((row) => row.firstName); // Adjust this based on the required fields

          if (filteredData.length > 0) {
            // Check if there is any valid data
            const jsonData = filteredData.map((row) => {
              const obj = {};
              Object.keys(row).forEach((key) => {
                // Convert 'True' and 'False' strings to boolean values
                obj[key] =
                  row[key] === "True"
                    ? true
                    : row[key] === "False"
                    ? false
                    : row[key];
              });
              return obj;
            });

            try {
              const response = await protectedCall(
                "api/employee/bulk-upload",
                jsonData,
                "post"
              );

              if (!response.ok) {
                throw new Error("Network response was not ok");
              }

              // Handle successful response if needed
              const result = await response.json();

              // Show success toast
              toastRef.current.show({
                severity: "success",
                summary: "Success",
                detail: "CSV file uploaded successfully",
                life: 3000, // Duration in ms
              });

              // Close the dialog after successful upload
              setVisible(false);
            } catch (error) {
              console.error("Error uploading CSV data:", error);
              toastRef.current.show({
                severity: "error",
                summary: "Error",
                detail: `Error uploading CSV data: ${error.response.data.message}`,
                life: 3000,
              });
            } finally {
              toastRef.current.show({
                severity: "success",
                summary: "Success",
                detail: `Employees added successfully`,
                life: 3000,
              });

              setLoader(false);
              e.options.clear();
              setVisible(false);
            }

            setCsvData(jsonData); // Store the transformed data
          } else {
            console.error("No valid data to process from CSV.");
            setLoader(false);
          }
        },
      });
    } else {
      console.error("No files to upload.");
      setLoader(false);
    }
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "public/sampleDataForEmployeeBulkUpload.csv"; // Provide the correct path to your local CSV file
    link.download = "file.csv"; // Set the name of the downloaded file
    link.click(); // Trigger the download
  };

  return (
    <>
      <Toast ref={toastRef} /> {/* Toast component for notifications */}
      {loader && <InfinityLoader />}
      <ConfirmDialog /> {/* ConfirmDialog component for confirmation */}
      <>
        <div
          className="w-ful py-3"
          style={{ display: "flex", justifyContent: "end" }}
        >
          <button
            label="Show"
            onClick={() => setVisible(true)}
            className="bg-blue-500 border-none text-white px-4 py-2 border-round-sm font-semibold text-base cursor-pointer hover:bg-blue-700"
          >
            Bulk upload <i className="fa-solid fa-upload"></i>
          </button>
          <Dialog
            header="Upload or drag and drop CSV file"
            visible={visible}
            style={{ width: "50vw" }}
            onHide={() => setVisible(false)}
          >
            {loader && (
              <div className="absolute w-full h-full flex justify-content-center align-items-center z-5">
                <span> Uploading csv file please wait</span>
                <i
                  className="pi pi-spin pi-spinner"
                  style={{ fontSize: "20px" }}
                ></i>

                {/* Spinner Icon */}
              </div>
            )}

            <div style={{ opacity: loader ? 0.5 : 1 }}>
              <FileUpload
                name="demo"
                customUpload
                uploadHandler={myUploader}
                // accept=".csv"
              ></FileUpload>
            </div>

            {/* Download Button */}
            <div className="flex justify-content-end mt-3">
              <button
                onClick={handleDownload}
                className="p-button p-button-outlined p-button-info"
              >
                Download CSV Format
              </button>
            </div>
          </Dialog>
        </div>
        <Table
          products={products}
          addBtnName={<i className="fa-solid fa-plus"></i>}
          setProducts={setProducts}
          size="large"
          actions={actions}
          head={head}
          addBtnAction={() => {
            navigate("/employee_list/add");
          }}
          tableStyle={tableStyle}
          tableName={tableName}
          btnStyle={{}}
          btnWrapperStyle={{}}
          tableHeaderStyle={{}}
          paginationStyle={{}}
          tableBodyStyle={{}}
          btnClassName=""
          btnWrapperClassName=""
          tableHeaderClassName=""
          paginationClassName=""
          tableBodyClassName=""
          formStyles={formStyles}
          setRow={setRow}
          setMenuOpen={setMenuOpen}
          isMenuOpen={isMenuOpen}
          defaultFilter={["photo"]}
        />
      </>
    </>
  );
}
