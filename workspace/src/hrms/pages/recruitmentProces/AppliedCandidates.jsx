import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { protectedCall } from "../../../services/userService";
import Table from "../../../components/table/Table";
import { Calendar } from "primereact/calendar";
import { Dialog } from "primereact/dialog";
import InfinityLoader from "../../../components/loader/Infinity";

const tableName = "Applied candidates";

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

export default function AppliedCandidates() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const [row, setRow] = useState({});
  const [isMenuOpen, setMenuOpen] = useState(false);
  const toast = useRef(null); // Reference for Toast component
  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loader, setLoader] = useState(false);

  const head = Object.keys(
    products.length ? { ...products[0], action: "action" } : {}
  ).filter((elem) => elem !== "id" && elem !== "logo");

  const actions = [
    {
      label: "Edit",
      icon: "pi pi-pen-to-square",
      command: () => {
        navigate("/applied_candidates/edit", {
          state: { id: row?.id },
        });
      },
    },
    {
      label: "View",
      icon: "pi pi-eye",
      command: () => {
        navigate("/applied_candidates/view", {
          state: { id: row?.id },
        });
      },
    },
    {
      label: "Delete",
      icon: "pi pi-trash",
      command: () => {
        confirmDialog({
          message: "Are you sure you want to delete this Candidate profile?",
          header: "Confirmation",
          icon: "pi pi-exclamation-triangle",
          accept: async () => {
            try {
              await protectedCall(
                "api/candidate-applications/remove",
                { id: row?.id },
                "post"
              );
              // Refresh the products after deletion
              const data = await protectedCall(
                "api/candidate-applications/applied/candidates"
              );
              setProducts(Array.isArray(data) ? data : []);
              toast.current.show({
                severity: "success",
                summary: "Successful",
                detail: "Candidate application deleted successfully.",
              });
            } catch (error) {
              toast.current.show({
                severity: "error",
                summary: "Error",
                detail: "Failed to delete Candidate application.",
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
    {
      label: "Schedule interview",
      icon: "pi pi-check",
      command: () => {
        setDialogVisible(true); // Open the date selection dialog
      },
    },
  ];

  const scheduleInterview = async () => {
    setLoader(true);

    if (!selectedDate) {
      toast.current.show({
        severity: "warn",
        summary: "Warning",
        detail: "Please select a date for the interview.",
      });
      return;
    }
    // Convert the selected date to YYYY-MM-DD format
    const formattedDate = selectedDate.toISOString().split("T")[0]; // Get just the date part
    try {
      await protectedCall(
        "api/candidate-applications/update-status",
        { id: row?.id, status: "scheduled", interviewDate: formattedDate },
        "post"
      );
      const data = await protectedCall(
        "api/candidate-applications/applied/candidates"
      );
      setProducts(data.length > 0 ? data : []); // Set data if available, otherwise set to empty array

      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "Interview scheduled successfully.",
      });
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to schedule the interview.",
      });
    } finally {
      setDialogVisible(false); // Close the dialog
      setSelectedDate(null); // Reset the date
      setLoader(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await protectedCall(
          "api/candidate-applications/applied/candidates"
        );
        setProducts(data.length > 0 ? data : []); // Set data if available, otherwise set to empty array
      } catch (error) {
        console.error("Error fetching data:", error);
        setProducts([]); // Optionally set to empty array on error
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <Toast ref={toast} /> {/* Toast component for notifications */}
      {loader && <InfinityLoader />}
      <ConfirmDialog /> {/* ConfirmDialog component for confirmation */}
      <Table
        products={products}
        addBtnName={""}
        setProducts={setProducts}
        size="large"
        actions={actions}
        head={head}
        addBtnAction={() => {
          navigate("/job_application");
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
        defaultFilter={[
          "updatedOn",
          "interviewDate",
          "status",
          "isActive",
          "createdOn",
          "requirementId",
          "comments",
          "joiningDate",
          "expireDate",
          "ctc",
          "reason",
        ]}
      />
      <Dialog
        header="Schedule Interview"
        visible={dialogVisible}
        style={{ width: "30vw" }}
        onHide={() => setDialogVisible(false)}
      >
        <div>
          <label htmlFor="interviewDate">Select Interview Date:</label>
          <Calendar
            id="interviewDate"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.value)}
            dateFormat="mm/dd/yy"
            minDate={new Date()} // This restricts to future dates
            showIcon
          />
        </div>
        <div className="flex gap-4 pt-4">
          <button
            onClick={() => setDialogVisible(false)}
            className="bg-red-600 border-none text-white p-2 text-base   cursor-pointer "
            style={{ borderRadius: "5px" }}
          >
            Cancel
          </button>
          <button
            onClick={scheduleInterview}
            style={{ borderRadius: "5px" }}
            className="bg-green-600 border-none text-white p-2 text-base font-medium cursor-pointer flex items-center"
          >
            {loader ? (
              <>
                <span className="loader mr-2"></span> Scheduling...
              </>
            ) : (
              "Schedule"
            )}
          </button>
        </div>
      </Dialog>
    </>
  );
}
