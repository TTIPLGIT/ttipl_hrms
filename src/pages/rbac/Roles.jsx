import { useEffect, useState } from "react";
import Table from "../../components/table/Table";
import { useNavigate } from "react-router-dom";
import { protectedCall } from "../../services/userService";

export default function Roles() {
  const [row, setRow] = useState({});
  const navigate = useNavigate();
  const [isMenuOpen, setMenuOpen] = useState(false);

  const [roles, setRoles] = useState([]);

  const tableName = "Role Permissions";

  useEffect(() => {
    const fetchData = async () => {
      const newRoles = await protectedCall("/api/roles");

      setRoles(
        newRoles.map((elem) => {
          return {
            id: elem.id,
            Role_Name: elem.name,
          };
        })
      );
    };
    fetchData();
  }, []);

  const actions = [
    {
      label: "Edit",
      icon: "pi pi-pen-to-square",
      command: () => {
        navigate("/role_permissions/edit", {
          state: { id: row?.id, roleName: row?.Role_Name, action: "edit" },
        });
      },
    },
    {
      label: "View",
      icon: "pi pi-eye",
      command: () => {
        navigate("/role_permissions/view", {
          state: { id: row?.id, roleName: row?.Role_Name, action: "view" },
        });
      },
    },
    {
      label: "Delete",
      icon: "pi pi-trash",
      command: () => async () => {
        await protectedCall(
          `/api/roles/activeStatus`,
          {
            id: row?.id,
            action: "diable",
          },
          "post"
        );

        setMenuOpen(false);
      },
    },
  ];

  const head = Object.keys(
    roles.length ? { ...roles[0], action: "action" } : {}
  );

  return (
    <Table
      products={roles}
      setProducts={setRoles}
      tableName={tableName}
      size="large"
      actions={actions}
      head={head}
      addBtnAction={() => {
        navigate("/role_permissions/add_role");
      }}
      setRow={setRow}
      setMenuOpen={setMenuOpen}
      isMenuOpen={isMenuOpen}
    />
  );
}
// roles.jsx
