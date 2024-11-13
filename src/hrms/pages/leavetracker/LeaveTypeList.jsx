import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Table from "../../../components/table/Table";
import { protectedCall } from "../../../services/userService";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog"; // Import ConfirmDialog and confirmDialog
import InfinityLoader from "../../../components/loader/Infinity";

const tableName = "Leave Type List";

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

export default function LeaveTypeList() {
  const [loader, setLoader1] = useState(false);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const [row, setRow] = useState({});
  const [isMenuOpen, setMenuOpen] = useState(false);
  const toast = useRef(null); // Reference for Toast component
  const [definedHead, setDefined] = useState({});

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
        navigate("/leave_type/edit", {
          state: { id: row?.id },
        });
      },
    },
    {
      label: "View",
      icon: "pi pi-eye",
      command: () => {
        navigate("/leave_type/view", {
          state: { id: row?.id },
        });
      },
    },
    {
      label: "Delete",
      icon: "pi pi-trash",
      command: () => {
        confirmDialog({
          message: "Are you sure you want to delete this Leave Type?",
          header: "Confirmation",
          icon: "pi pi-exclamation-triangle",
          accept: async () => {
            try {
              await protectedCall("api/master/delete", { id: row?.id }, "post");
              // Refresh the products after deletion
              const data = await protectedCall("api/master");
              setProducts(data.length > 0 ? data : []);
              toast.current.show({
                severity: "success",
                summary: "Successful",
                detail: "Leave Type deleted successfully.",
              });
            } catch (error) {
              toast.current.show({
                severity: "error",
                summary: "Error",
                detail: "Failed to delete Leave Type.",
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
      setLoader1(true); // Set loader to true before fetching
      try {
        const data = await protectedCall("api/master");
        setDefined(data[0]);

        setProducts(data.length > 0 ? data : []);
      } catch (error) {
        console.error("Failed to fetch Leave Type data", error);
      } finally {
        setLoader1(false); // Set loader to false once data is fetched or in case of error
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
        addBtnName={<i className="fa-solid fa-plus"></i>}
        setProducts={setProducts}
        size="large"
        actions={actions}
        head={head}
        addBtnAction={() => {
          navigate("/leave_type/add");
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
      />
    </>
  );
}
