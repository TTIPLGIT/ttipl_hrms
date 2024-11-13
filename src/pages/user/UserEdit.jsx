import { useLocation, useNavigate } from "react-router-dom";
import CustomFormWrapper from "../../components/form/customForm/CustomFormWrapper";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "./userSlice";

const formDT = [
  {
    labelText: "Code",
    name: "code",
    id: "code",
    placeholder: "Enter Product Code",
    type: "text",
    defaultValue: "",
    disabled: "",
    required: "Enter Product Code",
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
  },
  {
    labelText: "Description",
    name: "description",
    id: "description",
    placeholder: "Enter Product Description",
    type: "textarea",
    defaultValue: "",
    disabled: "",
    required: "Enter Product Description",
  },
  {
    labelText: "Image",
    name: "image",
    id: "image",
    type: "text",
    defaultValue: "",
    disabled: "",
    required: "Enter Product Image",
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
    type: "select",
    defaultValue: "",
    disabled: "",
    required: "Enter Product Category",
    options: ["Fitness", "Accessories", "Clothing", "Electronics"],
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
    name: "inventoryStatus",
    id: "inventoryStatus",
    placeholder: "Enter Product Category",
    type: "radio",
    defaultValue: "",
    disabled: "",
    required: "Enter Product Category",
    options: ["INSTOCK", "OUTOFSTOCK", "LOWSTOCK"],
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

export default function UserEdit() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();

  const selector = useSelector((select) => select.user);
  const filteredData = selector?.userData?.filter(
    (elem) => elem?.id === state?.id
  );
  const newFormData = formDT?.map((elem) => {
    return { ...elem, defaultValue: filteredData[0][elem?.id] };
  });

  return (
    <CustomFormWrapper
      formName="Edit User"
      formDT={newFormData}
      submitAction={(e) => {
        const dataWithId = { id: state?.id, ...e };
        dispatch(updateUser(dataWithId));
        navigate("/products_list");
      }}
    />
  );
}
