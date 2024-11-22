import { useState, useEffect, useRef } from "react";
import { Tree } from "primereact/tree";

import { protectedCall } from "../../services/userService";
import { useLocation, useNavigate } from "react-router-dom";

import styles from "./styles.module.css";
import Button from "../../components/button/Button";
import { Toast } from "primereact/toast";

export default function RolePermissionsEditAndView() {
  const [nodes, setNodes] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState({});
  const { state } = useLocation();
  const [rawMenu, setRawMenu] = useState();
  const navigate = useNavigate();

  const mapUamToTreeNodes = (uam) => {
    return uam.map((module) => ({
      key: `module-${module.moduleId}`,
      label: module.moduleName,
      data: `Module ${module.moduleId}`,
      children: [
        ...module.subModules.map((subModule) => ({
          key: `subModule-${subModule.subModuleId}`,
          label: subModule.subModuleName,
          data: `SubModule ${subModule.subModuleId}`,
          children: subModule.subModuleScreens.map((screen) => ({
            key: `screen-${screen.screenId}`,
            label: screen.screenName,
            data: `Screen ${screen.screenId}`,
            children: screen.actions.map((action) => ({
              key: `action-${screen.screenId}-${action.id}`,
              label: action.name,
              data: action.id,
            })),
          })),
        })),
        ...module.screens.map((screen) => ({
          key: `screen-${screen.screenId}`,
          label: screen.screenName,
          data: `Screen ${screen.screenId}`,
          children: screen.actions.map((action) => ({
            key: `action-${screen.screenId}-${action.id}`,
            label: action.name,
            data: action.id,
          })),
        })),
      ],
    }));
  };

  const mapRolePermissionsToSelectedKeys = (permissions) => {
    let selectedKeys = {};

    permissions.forEach((module) => {
      let moduleChecked = false;

      module.subModules.forEach((subModule) => {
        let subModuleChecked = false;

        subModule.subModuleScreens.forEach((screen) => {
          let screenChecked = false;

          screen.actions.forEach((action) => {
            if (action.hasPermission) {
              selectedKeys[`action-${screen.screenId}-${action.id}`] = {
                checked: true,
                partialChecked: false,
              };
              screenChecked = true;
            }
          });

          if (screenChecked) {
            selectedKeys[`screen-${screen.screenId}`] = {
              checked: true,
              partialChecked: false,
            };
            subModuleChecked = true;
          }
        });

        if (subModuleChecked) {
          selectedKeys[`subModule-${subModule.subModuleId}`] = {
            checked: true,
            partialChecked: false,
          };
          moduleChecked = true;
        }
      });

      module.screens.forEach((screen) => {
        let screenChecked = false;

        screen.actions.forEach((action) => {
          if (action.hasPermission) {
            selectedKeys[`action-${screen.screenId}-${action.id}`] = {
              checked: true,
              partialChecked: false,
            };
            screenChecked = true;
          }
        });

        if (screenChecked) {
          selectedKeys[`screen-${screen.screenId}`] = {
            checked: true,
            partialChecked: false,
          };
          moduleChecked = true;
        }
      });

      if (moduleChecked) {
        selectedKeys[`module-${module.moduleId}`] = {
          checked: true,
          partialChecked: false,
        };
      }
    });

    return selectedKeys;
  };

  const CallApi = (selectedKeys, nodes, roleName) => {
    const permissions = [];

    rawMenu?.forEach((module) => {
      // Process subModules

      module?.subModules?.forEach((subModule) => {
        subModule?.subModuleScreens?.forEach((screen) => {
          const actionIds = [];

          // Check selected actions in the screen
          screen?.actions?.forEach((action) => {
            const key = `action-${screen.screenId}-${action.id}`;
            if (selectedKeys[key] && selectedKeys[key].checked) {
              actionIds.push(action.id); // Collect action IDs
            }
          });

          // If there are selected actions for this screen, add it to permissions
          if (actionIds.length > 0) {
            permissions.push({
              id: module.moduleId, // Use moduleId directly
              screenId: screen.screenId, // Use screenId directly
              actionIds: actionIds,
            });
          }
        });
      });

      // Process top-level screens
      module?.screens?.forEach((screen) => {
        const actionIds = [];

        screen?.actions?.forEach((action) => {
          const key = `action-${screen.screenId}-${action.id}`;
          if (selectedKeys[key] && selectedKeys[key].checked) {
            actionIds.push(action.id); // Collect action IDs
          }
        });

        if (actionIds.length > 0) {
          permissions.push({
            id: module.moduleId, // Use moduleId directly
            screenId: screen.screenId, // Use screenId directly
            actionIds: actionIds,
          });
        }
      });
    });

    return {
      name: `${roleName} Updated`,
      description: `Updated ${roleName} role`,
      permissions: permissions,
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (state?.id) {
          const menu = await protectedCall(`/api/menu-creator`);
          const rolePermission = await protectedCall(
            `/api/menu-creator/${state?.id}`
          );

          // Set the tree nodes
          setNodes(mapUamToTreeNodes(menu?.menus));

          // Set the selected keys
          setSelectedKeys(mapRolePermissionsToSelectedKeys(rolePermission));

          setRawMenu(menu?.menus);
        }
      } catch (e) {
        console.error(e.message);
      }
    };

    fetchData();
  }, [state?.id]);

  const toast = useRef(null);
  const showError = (errorMsg) => {
    toast.current.show({
      severity: "error",
      summary: "Error",
      detail: errorMsg,
      life: 3000,
    });
  };

  const showInfo = (info) => {
    toast.current.show({
      severity: "success",
      summary: "Success",
      detail: info,
      life: 3000,
    });
  };

  const handleUpdate = async () => {
    if (state?.id)
      try {
        const transformed = CallApi(selectedKeys, nodes, "Admin");
        await protectedCall(`/api/roles/${state?.id}`, transformed, "post");
        showInfo("Role Updated Successful");
        const timer = setTimeout(() => {
          navigate("/role_permissions");
        }, 2000);
      } catch (e) {
        toast.current.clear();
        showError(e?.message);
      }
  };

  return (
    <>
      <div className={styles.addMenuWrapper}>
        <h3>Role : {state?.roleName}</h3>
      </div>
      <div
        className={styles.menuWrapper}
        style={{
          height: "70vh",
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Tree
          value={nodes}
          selectionMode="checkbox"
          selectionKeys={selectedKeys}
          onSelectionChange={(e) => {
            if (state?.action === "edit") setSelectedKeys(e.value);
          }}
          className="w-full border-none bg-transparent"
        />
        <div className="flex gap-5">
          {state?.action === "edit" && (
            <Button name={"Update"} onClick={handleUpdate} />
          )}
          <Button
            name={"Back"}
            onClick={(e) => {
              e.preventDefault();
              navigate(-1);
            }}
            color={{ bg: "red" }}
            icon={{ BorAname: "a", iconName: "pi pi-angle-right" }}
          />
        </div>
      </div>
      <Toast ref={toast} />
    </>
  );
}
