import { useState, useEffect, useRef } from "react";
import { Tree } from "primereact/tree";

import { protectedCall } from "../../services/userService";

import styles from "./styles.module.css";
import Button from "../../components/button/Button";
import TextInput from "../../components/form/text/TextInput";
import { useForm } from "react-hook-form";
import { Toast } from "primereact/toast";
import { useNavigate } from "react-router-dom";

export default function AddRole() {
  const [nodes, setNodes] = useState([]);

  const navigate = useNavigate("");
  const [selectedKeys, setSelectedKeys] = useState({});

  const [rawMenu, setRawMenu] = useState();

  const { register, handleSubmit } = useForm();

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

  const CallApi = (selectedKeys, nodes, roleName, description) => {
    const permissions = [];

    nodes?.forEach((module) => {
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
      name: roleName,
      description: description,
      permissions: permissions,
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const menu = await protectedCall(`/api/menu-creator`);
        setNodes(mapUamToTreeNodes(menu?.menus));

        setRawMenu(menu?.menus);
      } catch (e) {
        console.error(e.message);
      }
    };

    fetchData();
  }, []);

  const showInfo = (info) => {
    toast.current.show({
      severity: "success",
      summary: "Success",
      detail: info,
      life: 3000,
    });
  };
  const handleAdd = async (data) => {
    try {
      const transformed = CallApi(
        selectedKeys,
        rawMenu,
        data?.role,
        data?.description
      );
      await protectedCall("/api/roles", transformed, "post");
      showInfo("Role Added Successful");
    } catch (e) {
      toast.current.clear();
      showError(e?.message);
    }
  };

  const toast = useRef(null);
  const showError = (errorMsg) => {
    toast.current.show({
      severity: "error",
      summary: "Error",
      detail: errorMsg,
      life: 3000,
    });
  };

  const onError = (e) => {
    let count = 0;

    [e?.role, e?.description].forEach((elem) => {
      if (elem && count === 0) {
        toast.current.clear();
        const errorMsg = elem?.message;
        showError(errorMsg);
        count++;
      }
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit(handleAdd, onError)}>
        <div className={styles.addMenuWrapper}>
          <div>
            <TextInput
              id="role"
              name="role"
              register={register}
              labelText={"Role"}
              required={"Enter Role"}
            />
          </div>
          <div className="ml-2">
            <TextInput
              id="description"
              name="description"
              register={register}
              labelText={"Description"}
              required={"Enter Description"}
            />
          </div>
        </div>
        <div
          className={styles.menuWrapper}
          style={{
            height: "69vh",
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
              setSelectedKeys(e.value);
            }}
            className="w-full border-none bg-transparent"
          />
          <div className="flex gap-5">
            <Button
              name={"Add Role"}
              icon={{ BorAname: "b", iconName: "pi pi-user-plus mr-1" }}
            />
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
      </form>
      <Toast ref={toast} />
    </>
  );
}
