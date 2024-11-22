import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Table from "../../../components/table/Table";
import { protectedCall } from "../../../services/userService";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog"; // Import ConfirmDialog and confirmDialog

const tableName = "Team Complaints";

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
    btnText: "+",
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

export default function ComplaintsList() {
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
        navigate("/complaints/edit", {
          state: { id: row?.id },
        });
      },
    },
    {
      label: "View",
      icon: "pi pi-eye",
      command: () => {
        navigate("/complaints/view", {
          state: { id: row?.id },
        });
      },
    },
    {
      label: "Delete",
      icon: "pi pi-trash",
      command: () => {
        confirmDialog({
          message: "Are you sure you want to delete this organization?",
          header: "Confirmation",
          icon: "pi pi-exclamation-triangle",
          accept: async () => {
            try {
              await protectedCall(
                "api/complaints/delete",
                { id: row?.id },
                "post"
              );
              // Refresh the products after deletion
              const data = await protectedCall("api/complaints");
              setProducts(data.length > 0 ? data : []); // Set data if available, otherwise set to empty array
              toast.current.show({
                severity: "success",
                summary: "Successful",
                detail: "Complaint deleted successfully.",
              });
            } catch (error) {
              toast.current.show({
                severity: "error",
                summary: "Error",
                detail: "Failed to delete Complaint.",
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
      const data = await protectedCall("api/complaints");
      setProducts(data.length > 0 ? data : []); // Set data if available, otherwise set to empty array
      setDefined(data[0]);
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
          navigate("/complaints/add");
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
        defaultFilter={["updatedOn", "isActive"]}
        renderRow={(row) => (
          <>
            {head.map((column) => {
              let content = row[column];

              // Apply status conditional styling
              if (column === "status") {
                const statusStyle =
                  content === "closed"
                    ? { color: "green", fontWeight: "bold" }
                    : { color: "red", fontWeight: "bold" };

                content = (
                  <span style={statusStyle}>
                    {content} {/* Display 'closed' in green, 'open' in red */}
                  </span>
                );
              }

              return <td key={column}>{content}</td>;
            })}
          </>
        )}
      />
    </>
  );
}
