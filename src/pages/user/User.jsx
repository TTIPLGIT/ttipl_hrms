import { useEffect, useState } from "react";
import Table from "../../components/table/Table";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deleteUser, userDataFetch } from "./userSlice";
import { protectedCall } from "../../services/userService";

const tableName = "User Management";

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

export default function User() {
  const [products, setProducts] = useState([]);
  const dispatch = useDispatch();
  const selector = useSelector((select) => select.user);
  const navigate = useNavigate();

  const [row, setRow] = useState({});
  const [isMenuOpen, setMenuOpen] = useState(false);

  const head = Object.keys(
    products.length ? { ...products[0], action: "action" } : {}
  );

  const actions = [
    {
      label: "Edit",
      icon: "pi pi-pen-to-square",
      command: () => {
        navigate("/products_list/edit", { state: { id: row?.id } });
      },
    },
    {
      label: "View",
      icon: "pi pi-eye",
      command: () => {
        navigate("/products_list/view", { state: { id: row?.id } });
      },
    },
    {
      label: "Delete",
      icon: "pi pi-trash",
      command: () => {
        dispatch(deleteUser(products?.filter((elem) => elem?.id !== row?.id)));
        setMenuOpen(false);
      },
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      if (selector?.userData?.length === 0) {
        dispatch(userDataFetch({ protectedCall, useMock: true }));
      }
    };

    fetchData();
  }, [dispatch, selector.userData]);

  useEffect(() => {
    if (selector?.userData) {
      setProducts(selector.userData);
    }
  }, [selector?.userData]);

  return (
    <Table
      products={products}
      setProducts={setProducts}
      size="large"
      actions={actions}
      head={head}
      addBtnAction={() => {
        navigate("/products_list");
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
  );
}
