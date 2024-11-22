import { useForm } from "react-hook-form";
import Button from "../button/Button";
import TextInput from "../form/text/TextInput";
import { useEffect, useMemo, useRef, useState } from "react";
import ActionMenu from "../actionMenu/ActionMenu";
import { Toast } from "primereact/toast";

import styles from "./styles.module.css";
import { protectedCall } from "../../services/userService";
import { useNavigate } from "react-router-dom";

export default function UamMenu() {
  const [isMenuOpen, setMenuOpen] = useState({});
  const [isButtonClicked, setButtonClicked] = useState(false);

  const [allActions, setActions] = useState([]);

  const [collapse, setCollapse] = useState([]);
  const [uam, setUam] = useState([]);
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

  useEffect(() => {
    const fetchData = async () => {
      const menu = await protectedCall("/api/menu-creator");
      const newActions = await protectedCall("/api/actions");
      setUam(menu?.menus);
      setActions(newActions);
      isButtonClicked ? setButtonClicked(!isButtonClicked) : null;
    };
    fetchData();
  }, [isButtonClicked]);

  const transformModules = (modules) => {
    return modules.map((module) => {
      // Transform screens
      const screens = module.screens.map((screen) => ({
        ...screen,
        actions: screen.actions
          .filter((action) => action.hasPermission)
          .map((action) => action.id),
      }));

      // Transform subModules
      const subModules = module.subModules.map((subModule) => ({
        ...subModule,
        subModuleScreens: subModule.subModuleScreens.map((subModuleScreen) => ({
          ...subModuleScreen,
          actions: subModuleScreen.actions
            .filter((action) => action.hasPermission)
            .map((action) => action.id),
        })),
      }));

      return {
        ...module,
        screens,
        subModules,
      };
    });
  };

  const handleMenuSubmit = async () => {
    try {
      const transformed = transformModules(uam);
      await protectedCall("/api/menu-creator", transformed, "post");
      showInfo("Menu Updated Successful");
      setButtonClicked(true);
    } catch (e) {
      toast.current.clear();
      showError(e?.message);
    }
  };

  const handleClick = useMemo(
    () => (event, module) => {
      const key = Object.keys(module)[0];
      setMenuOpen({ [key]: module[key] });
    },
    [setMenuOpen]
  );
  const modalRef = useRef();

  const { handleSubmit, register, reset, setValue } = useForm();
  const [visible, setVisible] = useState({
    visible: false,
    id: "",
    type: "",
  });

  const handleCheckboxChange = (
    e,
    moduleIndex,
    screenIndex,
    subModuleIndex = null,
    subModuleScreenIndex = null
  ) => {
    const checked = e.target.checked;
    const actionId = Number(e.target.value); // Convert to number
    const updatedModules = [...uam];

    // Logic for subModules
    if (subModuleIndex !== null && subModuleScreenIndex !== null) {
      const subModuleScreenActions =
        updatedModules[moduleIndex].subModules[subModuleIndex].subModuleScreens[
          subModuleScreenIndex
        ].actions;

      // Find the action or add it if not present
      const action = subModuleScreenActions.find(
        (action) => action.id === actionId
      );

      if (action) {
        action.hasPermission = checked; // Update permission
      } else {
        // Add new action if not found
        subModuleScreenActions.push({ id: actionId, hasPermission: checked });
      }

      setUam(updatedModules);
    } else {
      // Logic for screens (when no subModules)
      const screenActions =
        updatedModules[moduleIndex].screens[screenIndex].actions;

      // Find the action or add it if not present
      const action = screenActions.find((action) => action.id === actionId);

      if (action) {
        action.hasPermission = checked; // Update permission
      } else {
        // Add new action if not found
        screenActions.push({ id: actionId, hasPermission: checked });
      }

      setUam(updatedModules);
    }
  };

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      setMenuOpen(false);
    }
  };
  useEffect(() => {
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleModuleCreation = (data) => {
    setUam((prev) => [
      ...prev,
      {
        moduleId: null,
        moduleName: data.mName,
        deleteModule: false,
        type: "module-type",
        moduleRoute: data.mRoute,
        subModules: [],
        screens: [],
      },
    ]);
    reset(); // Reset input fields
  };

  const handleModuleEdit = (data, index) => {
    const updatedModules = [...uam];
    updatedModules[index] = {
      ...updatedModules[index],
      moduleName: data.mNameEdit,
      moduleRoute: data.mRouteEdit,
    };
    setUam(updatedModules);
    reset(); // Reset input fields
    setVisible({ visible: false, id: "", type: "" });
  };

  const handleModuleDelete = (index) => {
    setUam((prev) =>
      prev.map((elem, i) => {
        if (i === index) {
          return { ...elem, deleteModule: true };
        }
        return elem;
      })
    );
  };

  const handleScreenCreation = (data, moduleIndex) => {
    const updatedModules = [...uam];
    updatedModules[moduleIndex].screens.push({
      screenId: null,
      screenName: data.sName,
      screenRoute: data.sRoute,
      actions: [],
      deleteScreen: false,
    });
    setUam(updatedModules);
    reset();
    setVisible({ visible: false, id: "", type: "" });
  };

  const handleScreenEdit = (data, moduleIndex, screenIndex) => {
    const updatedModules = [...uam];
    updatedModules[moduleIndex].screens[screenIndex] = {
      ...updatedModules[moduleIndex].screens[screenIndex],
      screenName: data.sName,
      screenRoute: data.sRoute,
    };
    setUam(updatedModules);
    reset();
    setVisible({ visible: false, id: "", type: "" });
  };

  const handleScreenDelete = (moduleIndex, screenIndex) => {
    const updatedModules = [...uam];
    updatedModules[moduleIndex].screens = updatedModules[
      moduleIndex
    ].screens.map((elem, i) => {
      if (i === screenIndex) {
        return { ...elem, deleteScreen: true };
      }
      return elem;
    });
    setUam(updatedModules);
  };

  const handleSubModuleCreation = (data, moduleIndex) => {
    const updatedModules = [...uam];
    updatedModules[moduleIndex].subModules.push({
      subModuleId: null,
      subModuleName: data.smName,
      subModuleRoute: data.smRoute,
      deleteSubModule: false,
      subModuleScreens: [],
    });
    setUam(updatedModules);
    reset();
    setVisible({ visible: false, id: "", type: "" });
  };

  const handleSubModuleEdit = (data, moduleIndex, subModuleIndex) => {
    const updatedModules = [...uam];
    updatedModules[moduleIndex].subModules[subModuleIndex] = {
      ...updatedModules[moduleIndex].subModules[subModuleIndex],
      subModuleName: data.smName,
      subModuleRoute: data.smRoute,
    };
    setUam(updatedModules);
    reset();
    setVisible({ visible: false, id: "", type: "" });
  };

  const handleSubModuleDelete = (moduleIndex, subModuleIndex) => {
    const updatedModules = [...uam];
    updatedModules[moduleIndex].subModules = updatedModules[
      moduleIndex
    ].subModules.map((elem, i) => {
      if (i === subModuleIndex) {
        return { ...elem, deleteSubModule: true };
      }
      return elem;
    });
    setUam(updatedModules);
  };

  const handleSubModuleScreenCreation = (data, moduleIndex, subModuleIndex) => {
    const updatedModules = [...uam];
    updatedModules[moduleIndex].subModules[
      subModuleIndex
    ].subModuleScreens.push({
      screenId: null,
      screenName: data.sName,
      screenRoute: data.sRoute,
      actions: [],
      deleteScreen: false,
    });
    setUam(updatedModules);
    reset();
    setVisible({ visible: false, id: "", type: "" });
  };

  const handleSubModuleScreenEdit = (
    data,
    moduleIndex,
    subModuleIndex,
    subModuleScreenIndex
  ) => {
    const updatedModules = [...uam];
    updatedModules[moduleIndex].subModules[subModuleIndex].subModuleScreens[
      subModuleScreenIndex
    ] = {
      ...updatedModules[moduleIndex].subModules[subModuleIndex]
        .subModuleScreens[subModuleScreenIndex],
      screenName: data.sName,
      screenRoute: data.sRoute,
    };
    setUam(updatedModules);
    reset();
    setVisible({ visible: false, id: "", type: "" });
  };

  const handleSubModuleScreenDelete = (
    moduleIndex,
    subModuleIndex,
    subModuleScreenIndex
  ) => {
    const updatedModules = [...uam];
    updatedModules[moduleIndex].subModules[subModuleIndex].subModuleScreens =
      updatedModules[moduleIndex].subModules[
        subModuleIndex
      ].subModuleScreens.map((elem, i) => {
        if (i === subModuleScreenIndex) {
          return { ...elem, deleteScreen: true };
        }
        return elem;
      });
    setUam(updatedModules);
    // console.log(updatedModules);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(handleModuleCreation)}
        className={styles.addMenuWrapper}
      >
        <div className="flex">
          <div style={{ paddingRight: "10px" }}>
            <TextInput
              id="mName"
              name="mName"
              register={register}
              labelText="Menu Name"
            />
          </div>
          <div style={{ paddingRight: "10px" }}>
            <TextInput
              id="mRoute"
              name="mRoute"
              register={register}
              labelText="Menu Route"
            />
          </div>
          <Button
            name="Add Menu"
            style={{ alignSelf: "center", marginTop: "20px" }}
          />
        </div>
      </form>

      <div className={styles.menuWrapper}>
        <p>Menu Builder</p>
        <div
          style={{
            marginTop: "20px",
            overflow: "auto",
            height: "56vh",
            position: "relative",
          }}
        >
          {uam.map(
            (module, moduleIndex) =>
              !module?.deleteModule && (
                <div key={moduleIndex} style={{ marginBottom: "20px" }}>
                  <div className="flex align-items-center">
                    {visible.visible &&
                    visible.type === "editModule" &&
                    visible.id === moduleIndex ? (
                      <form
                        onSubmit={handleSubmit((data) =>
                          handleModuleEdit(data, moduleIndex)
                        )}
                      >
                        <div className="flex" style={{ marginLeft: "5%" }}>
                          <div style={{ paddingRight: "10px" }}>
                            <TextInput
                              id="mNameEdit"
                              name="mNameEdit"
                              register={register}
                              labelText="Menu Name"
                            />
                          </div>
                          <div style={{ paddingRight: "10px" }}>
                            <TextInput
                              id="mRouteEdit"
                              name="mRouteEdit"
                              register={register}
                              labelText="Menu Route"
                            />
                          </div>
                          <Button
                            name="Edit Menu"
                            style={{
                              alignSelf: "center",
                              marginTop: "20px",
                            }}
                          />
                        </div>
                      </form>
                    ) : (
                      <div
                        className={styles.collapseBtn}
                        onClick={() => {
                          collapse.includes(`${moduleIndex} ${module}`)
                            ? setCollapse(
                                collapse.filter(
                                  (elem) => elem !== `${moduleIndex} ${module}`
                                )
                              )
                            : setCollapse((elem) => [
                                ...elem,
                                `${moduleIndex} ${module}`,
                              ]);
                        }}
                        onContextMenu={(event) => {
                          event.preventDefault();
                          handleClick(event, { moduleIndex: moduleIndex });
                        }}
                      >
                        <span>{module.moduleName}</span>
                        <i className="pi pi-chevron-down ml-2"></i>
                      </div>
                    )}

                    {isMenuOpen.moduleIndex === moduleIndex && (
                      <div
                        style={{
                          position: "absolute",
                        }}
                        ref={modalRef}
                      >
                        <ActionMenu
                          items={[
                            {
                              label: "Edit",
                              icon: "pi pi-pen-to-square",
                              command: () => {
                                setValue("mNameEdit", module.moduleName);
                                setValue("mRouteEdit", module.moduleRoute);
                                setVisible({
                                  visible: true,
                                  id: moduleIndex,
                                  type: "editModule",
                                });
                                setMenuOpen({ ...isMenuOpen, moduleIndex: "" });
                              },
                            },
                            {
                              label: "Delete",
                              icon: "pi pi-trash",
                              command: () => handleModuleDelete(moduleIndex),
                            },
                            {
                              label: "Add Submenu",
                              icon: "pi ",
                              command: () => {
                                setVisible({
                                  visible: true,
                                  id: moduleIndex,
                                  type: "submodule",
                                }),
                                  setMenuOpen({
                                    ...isMenuOpen,
                                    moduleIndex: "",
                                  });
                              },
                            },
                            {
                              label: "Add Screen",
                              icon: "pi ",
                              command: () => {
                                setVisible({
                                  visible: true,
                                  id: moduleIndex,
                                  type: "screen",
                                });
                                setMenuOpen({ ...isMenuOpen, moduleIndex: "" });
                              },
                            },
                          ]}
                        />
                      </div>
                    )}
                  </div>

                  {collapse.includes(`${moduleIndex} ${module}`) &&
                    module.screens.map(
                      (screen, screenIndex) =>
                        !screen?.deleteScreen && (
                          <div
                            key={`moduleScreen-${screen}-${screenIndex}-${moduleIndex}`}
                          >
                            {visible.visible &&
                            visible.type === "editScreen" &&
                            visible.id === `${moduleIndex}-${screenIndex}` ? (
                              <form
                                onSubmit={handleSubmit((data) =>
                                  handleScreenEdit(
                                    data,
                                    moduleIndex,
                                    screenIndex
                                  )
                                )}
                              >
                                <div
                                  className="flex"
                                  style={{ marginLeft: "5%" }}
                                >
                                  <div style={{ paddingRight: "10px" }}>
                                    <TextInput
                                      id="sName"
                                      name="sName"
                                      register={register}
                                      labelText="Screen Name"
                                    />
                                  </div>
                                  <div style={{ paddingRight: "10px" }}>
                                    <TextInput
                                      id="sRoute"
                                      name="sRoute"
                                      register={register}
                                      labelText="Screen Route"
                                    />
                                  </div>
                                  <Button
                                    name="Edit Screen"
                                    style={{
                                      alignSelf: "center",
                                      marginTop: "20px",
                                    }}
                                  />
                                </div>
                              </form>
                            ) : (
                              <div
                                key={`moduleScreen-${screen}-${screenIndex}-${moduleIndex}`}
                                style={{
                                  marginLeft: "5%",
                                  marginTop: "10px",
                                  marginBottom: "10px",
                                  width: "20%",
                                }}
                              >
                                <div
                                  onContextMenu={(e) => {
                                    e.preventDefault();
                                    handleClick(e, {
                                      screenIndex: screenIndex,
                                    });
                                  }}
                                  className={styles.collapseBtn}
                                >
                                  <span>{screen.screenName}</span>
                                </div>
                                {isMenuOpen.screenIndex === screenIndex && (
                                  <div
                                    style={{
                                      position: "absolute",
                                    }}
                                    ref={modalRef}
                                  >
                                    <ActionMenu
                                      items={[
                                        {
                                          label: "Edit",
                                          icon: "pi pi-pen-to-square",
                                          command: () => {
                                            setValue(
                                              "sName",
                                              screen.screenName
                                            );
                                            setValue(
                                              "sRoute",
                                              screen.screenRoute
                                            );
                                            setVisible({
                                              visible: true,
                                              id: `${moduleIndex}-${screenIndex}`,
                                              type: "editScreen",
                                            });
                                            setMenuOpen({
                                              ...isMenuOpen,
                                              screenIndex: "",
                                            });
                                          },
                                        },
                                        {
                                          label: "Delete",
                                          icon: "pi pi-trash",
                                          command: () =>
                                            handleScreenDelete(
                                              moduleIndex,
                                              screenIndex
                                            ),
                                        },
                                      ]}
                                    />
                                  </div>
                                )}

                                <div className="flex ml-2 mt-2">
                                  {allActions?.map((actionLabel, index) => (
                                    <div
                                      key={actionLabel?.id}
                                      style={{ marginLeft: "10px" }}
                                    >
                                      <input
                                        type="checkbox"
                                        id={`${moduleIndex}-${screenIndex}-${index}`}
                                        value={actionLabel?.id}
                                        defaultChecked={
                                          screen?.actions?.find(
                                            (elem) =>
                                              elem.id === actionLabel?.id
                                          )?.hasPermission
                                        }
                                        style={{
                                          height: "20px",
                                          width: "20px",
                                        }}
                                        onChange={
                                          (e) =>
                                            handleCheckboxChange(
                                              e,
                                              moduleIndex,
                                              screenIndex
                                            ) // Pass screenIndex here
                                        }
                                      />
                                      <label
                                        htmlFor={`${moduleIndex}-${screenIndex}-${index}`}
                                      >
                                        {actionLabel?.name}
                                      </label>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )
                    )}

                  {collapse.includes(`${moduleIndex} ${module}`) &&
                    module.subModules.map(
                      (subModule, subModuleIndex) =>
                        !subModule?.deleteSubModule && (
                          <div
                            key={`subModule-${moduleIndex}-${subModule}-${subModuleIndex}`}
                            style={{ marginLeft: "5%", marginTop: "10px" }}
                          >
                            <div className="flex align-items-center">
                              {visible.visible &&
                              visible.type === "editSubModule" &&
                              visible.id ===
                                `${moduleIndex}-${subModuleIndex}` ? (
                                <form
                                  onSubmit={handleSubmit((data) =>
                                    handleSubModuleEdit(
                                      data,
                                      moduleIndex,
                                      subModuleIndex
                                    )
                                  )}
                                >
                                  <div
                                    className="flex"
                                    style={{ marginLeft: "5%" }}
                                  >
                                    <div style={{ paddingRight: "10px" }}>
                                      <TextInput
                                        id="smName"
                                        name="smName"
                                        register={register}
                                        labelText="SubMenu Name"
                                      />
                                    </div>
                                    <div style={{ paddingRight: "10px" }}>
                                      <TextInput
                                        id="smRoute"
                                        name="smRoute"
                                        register={register}
                                        labelText="SubMenu Route"
                                      />
                                    </div>
                                    <Button
                                      name="Edit SubMenu"
                                      style={{
                                        alignSelf: "center",
                                        marginTop: "20px",
                                      }}
                                    />
                                  </div>
                                </form>
                              ) : (
                                <div
                                  key={`subModule-${moduleIndex}-${subModule}-${subModuleIndex}`}
                                  className={styles.collapseBtn}
                                  onClick={() => {
                                    collapse.includes(
                                      `${moduleIndex}-${subModuleIndex}`
                                    )
                                      ? setCollapse(
                                          collapse.filter(
                                            (elem) =>
                                              elem !==
                                              `${moduleIndex}-${subModuleIndex}`
                                          )
                                        )
                                      : setCollapse((elem) => [
                                          ...elem,
                                          `${moduleIndex}-${subModuleIndex}`,
                                        ]);
                                  }}
                                  onContextMenu={(event) => {
                                    event.preventDefault();

                                    handleClick(event, {
                                      subModuleIndex: subModuleIndex,
                                    });
                                  }}
                                >
                                  <span>{subModule.subModuleName}</span>
                                  <i className="pi pi-chevron-down ml-2"></i>
                                </div>
                              )}

                              {isMenuOpen.subModuleIndex === subModuleIndex && (
                                <div
                                  style={{
                                    position: "absolute",
                                  }}
                                  ref={modalRef}
                                >
                                  <ActionMenu
                                    items={[
                                      {
                                        label: "Edit",
                                        icon: "pi pi-pen-to-square",
                                        command: () => {
                                          setValue(
                                            "smName",
                                            subModule.subModuleName
                                          );
                                          setValue(
                                            "smRoute",
                                            subModule.subModuleRoute
                                          );
                                          setVisible({
                                            visible: true,
                                            id: `${moduleIndex}-${subModuleIndex}`,
                                            type: "editSubModule",
                                          });
                                          setMenuOpen({
                                            ...isMenuOpen,
                                            subModuleIndex: "",
                                          });
                                        },
                                      },
                                      {
                                        label: "Delete",
                                        icon: "pi pi-trash",
                                        command: () =>
                                          handleSubModuleDelete(
                                            moduleIndex,
                                            subModuleIndex
                                          ),
                                      },
                                      {
                                        label: "Add Screen",
                                        icon: "",
                                        command: () => {
                                          setVisible({
                                            visible: true,
                                            id: `${moduleIndex}-${subModuleIndex}`,
                                            type: "subScreen",
                                          });
                                          setMenuOpen({
                                            ...isMenuOpen,
                                            subModuleIndex: "",
                                          });
                                        },
                                      },
                                    ]}
                                  />
                                </div>
                              )}
                            </div>

                            {collapse.includes(
                              `${moduleIndex}-${subModuleIndex}`
                            ) &&
                              subModule.subModuleScreens.map(
                                (subModuleScreen, subModuleScreenIndex) =>
                                  !subModuleScreen?.deleteScreen && (
                                    <div
                                      key={`subModuleScreen-${subModuleScreen}-${subModuleScreenIndex}-${moduleIndex}`}
                                    >
                                      <div
                                        style={{
                                          marginLeft: "5%",
                                          marginTop: "10px",
                                          width:
                                            visible.visible &&
                                            visible.type ===
                                              "editSubModuleScreen" &&
                                            visible.id ===
                                              `${moduleIndex}-${subModuleIndex}-${subModuleScreenIndex}`
                                              ? "100%"
                                              : "20%",
                                        }}
                                      >
                                        {visible.visible &&
                                        visible.type ===
                                          "editSubModuleScreen" &&
                                        visible.id ===
                                          `${moduleIndex}-${subModuleIndex}-${subModuleScreenIndex}` ? (
                                          <form
                                            onSubmit={handleSubmit((data) =>
                                              handleSubModuleScreenEdit(
                                                data,
                                                moduleIndex,
                                                subModuleIndex,
                                                subModuleScreenIndex
                                              )
                                            )}
                                          >
                                            <div
                                              className="flex"
                                              style={{ marginLeft: "5%" }}
                                            >
                                              <div
                                                style={{ paddingRight: "10px" }}
                                              >
                                                <TextInput
                                                  id="sName"
                                                  name="sName"
                                                  register={register}
                                                  labelText="Screen Name"
                                                />
                                              </div>
                                              <div
                                                style={{ paddingRight: "10px" }}
                                              >
                                                <TextInput
                                                  id="sRoute"
                                                  name="sRoute"
                                                  register={register}
                                                  labelText="Screen Route"
                                                />
                                              </div>
                                              <Button
                                                name="Edit Screen"
                                                style={{
                                                  alignSelf: "center",
                                                  marginTop: "20px",
                                                }}
                                              />
                                            </div>
                                          </form>
                                        ) : (
                                          <div
                                            key={`subModuleScreen-${subModuleScreen}-${subModuleScreenIndex}-${moduleIndex}`}
                                            className={styles.collapseBtn}
                                            onContextMenu={(event) => {
                                              event.preventDefault();
                                              handleClick(event, {
                                                subModuleScreenIndex:
                                                  subModuleScreenIndex,
                                              });
                                            }}
                                          >
                                            <span>
                                              {subModuleScreen.screenName}
                                            </span>
                                          </div>
                                        )}
                                        {isMenuOpen.subModuleScreenIndex ===
                                          subModuleScreenIndex && (
                                          <div
                                            style={{
                                              position: "absolute",
                                            }}
                                            ref={modalRef}
                                          >
                                            <ActionMenu
                                              items={[
                                                {
                                                  label: "Edit",
                                                  icon: "pi pi-pen-to-square",
                                                  command: () => {
                                                    setValue(
                                                      "sName",
                                                      subModuleScreen.screenName
                                                    );
                                                    setValue(
                                                      "sRoute",
                                                      subModuleScreen.screenRoute
                                                    );
                                                    setVisible({
                                                      visible: true,
                                                      id: `${moduleIndex}-${subModuleIndex}-${subModuleScreenIndex}`,
                                                      type: "editSubModuleScreen",
                                                    });
                                                    setMenuOpen({
                                                      ...isMenuOpen,
                                                      subModuleScreenIndex: "",
                                                    });
                                                  },
                                                },
                                                {
                                                  label: "Delete",
                                                  icon: "pi pi-trash",
                                                  command: () =>
                                                    handleSubModuleScreenDelete(
                                                      moduleIndex,
                                                      subModuleIndex,
                                                      subModuleScreenIndex
                                                    ),
                                                },
                                              ]}
                                            />
                                          </div>
                                        )}
                                        <div className="flex mt-2 ml-2">
                                          {allActions?.map(
                                            (actionLabel, index) => (
                                              <div
                                                key={actionLabel?.id}
                                                style={{ marginLeft: "10px" }}
                                              >
                                                <input
                                                  type="checkbox"
                                                  id={`${moduleIndex}-${subModuleIndex}-${subModuleScreenIndex}-${index}`}
                                                  value={actionLabel?.id}
                                                  defaultChecked={
                                                    subModuleScreen?.actions?.find(
                                                      (elem) =>
                                                        elem.id ===
                                                        actionLabel?.id
                                                    )?.hasPermission
                                                  }
                                                  style={{
                                                    height: "20px",
                                                    width: "20px",
                                                  }}
                                                  onChange={
                                                    (e) =>
                                                      handleCheckboxChange(
                                                        e,
                                                        moduleIndex,
                                                        null, // No screenIndex
                                                        subModuleIndex,
                                                        subModuleScreenIndex
                                                      ) // Pass subModuleIndex and subModuleScreenIndex here
                                                  }
                                                />
                                                <label
                                                  htmlFor={`${moduleIndex}-${subModuleIndex}-${subModuleScreenIndex}-${index}`}
                                                >
                                                  {actionLabel?.name}
                                                </label>
                                              </div>
                                            )
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  )
                              )}

                            {visible.visible &&
                              visible.type === "subScreen" &&
                              visible.id ===
                                `${moduleIndex}-${subModuleIndex}` && (
                                <form
                                  onSubmit={handleSubmit((data) =>
                                    handleSubModuleScreenCreation(
                                      data,
                                      moduleIndex,
                                      subModuleIndex
                                    )
                                  )}
                                >
                                  <div
                                    className="flex"
                                    style={{ marginLeft: "10%" }}
                                  >
                                    <div style={{ paddingRight: "10px" }}>
                                      <TextInput
                                        id="sName"
                                        name="sName"
                                        register={register}
                                        labelText="Screen Name"
                                      />
                                    </div>
                                    <div style={{ paddingRight: "10px" }}>
                                      <TextInput
                                        id="sRoute"
                                        name="sRoute"
                                        register={register}
                                        labelText="Screen Route"
                                      />
                                    </div>
                                    <Button
                                      name="Add Screen"
                                      style={{
                                        alignSelf: "center",
                                        marginTop: "20px",
                                      }}
                                    />
                                  </div>
                                </form>
                              )}
                          </div>
                        )
                    )}

                  {visible.visible &&
                    visible.type === "submodule" &&
                    visible.id === moduleIndex && (
                      <form
                        onSubmit={handleSubmit((data) =>
                          handleSubModuleCreation(data, moduleIndex)
                        )}
                      >
                        <div className="flex" style={{ marginLeft: "5%" }}>
                          <div style={{ paddingRight: "10px" }}>
                            <TextInput
                              id="smName"
                              name="smName"
                              register={register}
                              labelText="SubModule Name"
                            />
                          </div>
                          <div style={{ paddingRight: "10px" }}>
                            <TextInput
                              id="smRoute"
                              name="smRoute"
                              register={register}
                              labelText="SubModule Route"
                            />
                          </div>
                          <Button
                            name="Add SubModule"
                            style={{
                              alignSelf: "center",
                              marginTop: "20px",
                            }}
                          />
                        </div>
                      </form>
                    )}

                  {visible.visible &&
                    visible.type === "screen" &&
                    visible.id === moduleIndex && (
                      <form
                        onSubmit={handleSubmit((data) =>
                          handleScreenCreation(data, moduleIndex)
                        )}
                      >
                        <div className="flex" style={{ marginLeft: "5%" }}>
                          <div style={{ paddingRight: "10px" }}>
                            <TextInput
                              id="sName"
                              name="sName"
                              register={register}
                              labelText="Screen Name"
                            />
                          </div>
                          <div style={{ paddingRight: "10px" }}>
                            <TextInput
                              id="sRoute"
                              name="sRoute"
                              register={register}
                              labelText="Screen Route"
                            />
                          </div>
                          <Button
                            name="Add Screen"
                            style={{
                              alignSelf: "center",
                              marginTop: "20px",
                            }}
                          />
                        </div>
                      </form>
                    )}
                </div>
              )
          )}
          <div className="flex justify-content-center">
            <Button name={"Submit"} onClick={handleMenuSubmit} />
          </div>
        </div>
      </div>
      <Toast ref={toast} />
    </>
  );
}
