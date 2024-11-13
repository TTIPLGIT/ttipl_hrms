import { useNavigate } from "react-router-dom";
import CustomFormWrapper from "../../components/form/customForm/CustomFormWrapper";
import { useDispatch } from "react-redux";
import { addUser } from "./userSlice";

const formDT = [
  {
    labelText: "Code",
    name: "code",
    id: "code",
    placeholder: "Enter Product Code",
    type: "text",
    defaultValue: "",
    disabled: "",
    required: "Enter Product Code ",
  },
  {
    labelText: "Name",
    name: "name",
    id: "name",
    placeholder: "Enter Product Name",
    type: "text",
    defaultValue: "",
    disabled: "",
    required: "Enter Product Name",
    validation: (e) => e === "Aakash" || "Name Should be Aakash",
  },
  {
    labelText: "mobile Num",
    name: "num",
    id: "num",
    placeholder: "Enter Number",
    type: "phone",
    defaultValue: "",
    disabled: "",
    required: "Enter number",
    // conditionRequired: true,
    // condition: "equal",
    // conditionInputName: "name",
    // compareValue: "Aakash",
  },
  {
    labelText: "Description",
    name: "description",
    id: "description",
    placeholder: "Enter Product Description",
    type: "otp",
    defaultValue: "",
    disabled: "",
    required: "Enter Product Description",
    // conditionRequired: true,
    // conditionInputName: "name",
    // condition: "equal",
    // compareValue: "Book",
  },

  {
    labelText: "Price",
    name: "price",
    id: "price",
    placeholder: "Enter Product price",
    type: "number",
    defaultValue: "",
    disabled: "",
    required: "Enter Product price",
  },
  {
    labelText: "Category",
    name: "category",
    id: "category",
    placeholder: "Enter Product Category",
    type: "checkbox",
    defaultValue: "",
    disabled: "",
    required: "Enter Product Category",
    options: ["Fitness", "Accessories", "Clothing", "Electronics"],
    fetchDataBasedOn: "code",
  },
  {
    labelText: "Quantity",
    name: "quantity",
    id: "quantity",
    placeholder: "Enter Product Quantity",
    type: "number",
    defaultValue: "",
    disabled: "",
    required: "Enter Product Quantity",
  },
  {
    labelText: "Inventory Status",
    name: "category",
    id: "category",
    placeholder: "Enter Product Category",
    type: "radio",
    defaultValue: "",
    disabled: "",
    required: "Enter Product Category",
    options: ["InStock", "OutOfStack", "LowStock"],
  },
  {
    labelText: "Rating",
    name: "rating",
    id: "rating",
    placeholder: "Give Rating Out Of Five",
    type: "number",
    defaultValue: "",
    disabled: "",
    required: "Give Rating Out Of Five",
  },
];
export default function UserAdd() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return (
    <>
      <CustomFormWrapper
        formName="Add User"
        formDT={formDT}
        submitAction={(e) => {
          dispatch(addUser(e));
          navigate("/products_list");
        }}
      />
    </>
  );
}
