import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { protectedCall } from "../../../../services/userService";
import Table from "../../../../components/table/Table";

const tableName = "Designation";

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
    btnText: "Add asset",
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

export default function DesignationList() {
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
        navigate("/designation/edit", {
          state: { id: row?.id },
        });
      },
    },
    {
      label: "View",
      icon: "pi pi-eye",
      command: () => {
        navigate("/designation/view", {
          state: { id: row?.id },
        });
      },
    },
    {
      label: "Delete",
      icon: "pi pi-trash",
      command: () => {
        confirmDialog({
          message: "Are you sure you want to delete this Designation?",
          header: "Confirmation",
          icon: "pi pi-exclamation-triangle",
          accept: async () => {
            try {
              await protectedCall(
                "api/requirement/designation/delete",
                { id: row?.id },
                "post"
              );
              // Refresh the products after deletion
              const data = await protectedCall("api/requirement/designation");
              setProducts(data.length > 0 ? data : []);
              toast.current.show({
                severity: "success",
                summary: "Successful",
                detail: "Designation deleted successfully.",
              });
            } catch (error) {
              toast.current.show({
                severity: "error",
                summary: "Error",
                detail: "Failed to delete Designation.",
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
      const data = await protectedCall("api/requirement/designation");
      setDefined(data[0]);
      setProducts(data.length > 0 ? data : []);
    };
    fetchData();
  }, []);

  return (
    <>
      <Toast ref={toast} /> {/* Toast component for notifications */}
      <ConfirmDialog /> {/* ConfirmDialog component for confirmation */}
      <Table
        products={products}
        addBtnName={<i className="fa-solid fa-plus"></i>}
        setProducts={setProducts}
        size="large"
        actions={actions}
        head={head}
        addBtnAction={() => {
          navigate("/designation/add");
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
