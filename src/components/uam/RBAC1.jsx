import { useState } from "react";
import styles from "./styles.module.css";

export default function RBAC() {
  const [collapse, setCollapse] = useState([]);

  const handleCollapse = (data) => {
    const newData = collapse.includes(data)
      ? collapse.filter((elem) => elem !== data)
      : [...collapse, data];
    setCollapse(newData);
  };

  const [uam, setUam] = useState([
    {
      moduleId: 5,
      moduleName: "Main Module - T 01",
      isSelected: true,
      subModules: [
        {
          subModuleId: 6,
          subModuleName: "SubModule - T 01",
          isSelected: true,
          subModuleScreens: [
            {
              screenId: 7,
              screenName: "SubModule Screen - T 01",
              isSelected: true,
              actions: [1, 2, 3],
            },
            {
              screenId: 98,
              screenName: "SubModule Screen - T 01",
              isSelected: true,
              actions: [1, 2, 3],
            },
          ],
        },
        {
          subModuleId: 11,
          subModuleName: "SubModule - T 02",
          isSelected: true,
          subModuleScreens: [
            {
              screenId: 12,
              screenName: "SubModule Screen - T 02",
              isSelected: true,
              actions: [1, 2, 3],
            },
          ],
        },
      ],
      screens: [
        {
          screenId: 8,
          screenName: "Main Module Screen - T 01",
          isSelected: true,
          actions: [1, 2],
        },
        {
          screenId: 10,
          screenName: "Main Module Screen - T 02",
          isSelected: true,
          actions: [1, 2],
        },
      ],
    },
    {
      moduleId: 14,
      moduleName: "Main Module - T 02",
      isSelected: true,
      subModules: [
        {
          subModuleId: 15,
          subModuleName: "SubModule - T 03",
          isSelected: true,
          subModuleScreens: [
            {
              screenId: 16,
              screenName: "SubModule Screen - T 03",
              isSelected: true,
              actions: [1, 2, 3],
            },
          ],
        },
        {
          subModuleId: 17,
          subModuleName: "SubModule - T 04",
          isSelected: true,
          subModuleScreens: [
            {
              screenId: 18,
              screenName: "SubModule Screen - T 04",
              isSelected: true,
              actions: [1, 2, 3],
            },
          ],
        },
      ],
      screens: [
        {
          screenId: 19,
          screenName: "Main Module Screen - T 03",
          isSelected: true,
          actions: [1, 2],
        },
        {
          screenId: 20,
          screenName: "Main Module Screen - T 04",
          isSelected: true,
          actions: [1, 2],
        },
      ],
    },
  ]);

  const updateIsSelected = (id, type, newValue, actionId = null) => {
    const updateSelection = (uam) => {
      return uam.map((module) => {
        if (type === "module" && module.moduleId === id) {
          // Module level update
          return {
            ...module,
            isSelected: newValue,
            subModules: module.subModules.map((subModule) => ({
              ...subModule,
              isSelected: newValue,
              subModuleScreens: subModule.subModuleScreens.map((screen) => ({
                ...screen,
                isSelected: newValue,
                actions: newValue ? [1, 2, 3] : [],
              })),
            })),
            screens: module.screens.map((screen) => ({
              ...screen,
              isSelected: newValue,
              actions: newValue ? [1, 2] : [],
            })),
          };
        }

        // Submodule level update
        const updatedSubModules = module.subModules.map((subModule) => {
          if (type === "subModule" && subModule.subModuleId === id) {
            return {
              ...subModule,
              isSelected: newValue,
              subModuleScreens: subModule.subModuleScreens.map((screen) => ({
                ...screen,
                isSelected: newValue,
                actions: newValue ? [1, 2, 3] : [],
              })),
            };
          }

          // Screen and actions update in subModule
          const updatedSubModuleScreens = subModule.subModuleScreens.map(
            (screen) => {
              if (type === "subScreen" && screen.screenId === id) {
                return {
                  ...screen,
                  isSelected: newValue,
                  actions: newValue ? [1, 2, 3] : [],
                };
              }
              if (type === "action" && screen.screenId === id) {
                const updatedActions = newValue
                  ? [...screen.actions, actionId]
                  : screen.actions.filter((action) => action !== actionId);
                const allActionsChecked = updatedActions.length === 3;
                return {
                  ...screen,
                  actions: updatedActions,
                  isSelected: allActionsChecked,
                };
              }
              return screen;
            }
          );

          const allSubScreensChecked = updatedSubModuleScreens.every(
            (screen) => screen.isSelected
          );

          return {
            ...subModule,
            subModuleScreens: updatedSubModuleScreens,
            isSelected: allSubScreensChecked,
          };
        });

        // Main module screen updates
        const updatedScreens = module.screens.map((screen) => {
          if (type === "screen" && screen.screenId === id) {
            return {
              ...screen,
              isSelected: newValue,
              actions: newValue ? [1, 2] : [],
            };
          }
          if (type === "action" && screen.screenId === id) {
            const updatedActions = newValue
              ? [...screen.actions, actionId]
              : screen.actions.filter((action) => action !== actionId);
            const allActionsChecked = updatedActions.length === 2;
            return {
              ...screen,
              actions: updatedActions,
              isSelected: allActionsChecked,
            };
          }
          return screen;
        });

        const allScreensChecked = updatedScreens.every(
          (screen) => screen.isSelected
        );
        const allSubModulesChecked = updatedSubModules.every(
          (subModule) => subModule.isSelected
        );

        return {
          ...module,
          subModules: updatedSubModules,
          screens: updatedScreens,
          isSelected: allScreensChecked && allSubModulesChecked,
        };
      });
    };

    setUam((prevUam) => updateSelection(prevUam));
  };

  const handleCheckboxChange = (
    e,
    moduleIndex,
    subModuleIndex = null,
    screenIndex = null,
    actionIndex = null
  ) => {
    const isChecked = e.target.checked;
    const id = e.target.id.split("-").pop();
    let type = "";

    if (actionIndex !== null) {
      type = "action";
      updateIsSelected(
        parseInt(id),
        type,
        isChecked,
        parseInt(actionIndex) + 1
      );
    } else if (subModuleIndex === null && screenIndex === null) {
      type = "module";
      updateIsSelected(parseInt(id), type, isChecked);
    } else if (screenIndex === null) {
      type = "subModule";
      updateIsSelected(parseInt(id), type, isChecked);
    } else {
      type = "subScreen";
      updateIsSelected(parseInt(id), type, isChecked);
    }
  };

  return (
    <>
      {uam.map((module, moduleIndex) => (
        <div key={module.moduleId}>
          <div className="flex align-items-center">
            <span
              className={styles.plusMinus}
              onClick={() => handleCollapse(moduleIndex)}
            >
              {collapse.includes(moduleIndex) ? "-" : "+"}
            </span>
            <input
              type="checkbox"
              id={`module-check-${module.moduleId}`}
              checked={module.isSelected}
              onChange={(e) => handleCheckboxChange(e, moduleIndex)}
            />
            <span>{module.moduleName}</span>
          </div>

          {collapse.includes(moduleIndex) &&
            module.subModules.map((subModule, subModuleIndex) => (
              <div key={subModule.subModuleId} style={{ marginLeft: "20px" }}>
                <div className="flex align-items-center">
                  <span
                    className={styles.plusMinus}
                    onClick={() =>
                      handleCollapse(`${moduleIndex}-${subModuleIndex}`)
                    }
                  >
                    {collapse.includes(`${moduleIndex}-${subModuleIndex}`)
                      ? "-"
                      : "+"}
                  </span>
                  <input
                    type="checkbox"
                    id={`submodule-check-${subModule.subModuleId}`}
                    checked={subModule.isSelected}
                    onChange={(e) =>
                      handleCheckboxChange(e, moduleIndex, subModuleIndex)
                    }
                  />
                  <span>{subModule.subModuleName}</span>
                </div>

                {collapse.includes(`${moduleIndex}-${subModuleIndex}`) &&
                  subModule.subModuleScreens.map((subScreen, screenIndex) => (
                    <div
                      key={subScreen.screenId}
                      style={{ marginLeft: "40px" }}
                    >
                      <div className="flex align-items-center">
                        <input
                          type="checkbox"
                          id={`subscreen-check-${subScreen.screenId}`}
                          checked={subScreen.isSelected}
                          onChange={(e) =>
                            handleCheckboxChange(
                              e,
                              moduleIndex,
                              subModuleIndex,
                              screenIndex
                            )
                          }
                        />
                        <span>{subScreen.screenName}</span>
                      </div>

                      <div className="flex align-items-center">
                        {["Create", "Edit", "View", "Delete"].map(
                          (action, actionIndex) => (
                            <div key={actionIndex}>
                              <input
                                type="checkbox"
                                id={`action-check-${subScreen.screenId}-${actionIndex}`}
                                checked={subScreen.actions.includes(
                                  actionIndex + 1
                                )}
                                onChange={(e) =>
                                  handleCheckboxChange(
                                    e,
                                    moduleIndex,
                                    subModuleIndex,
                                    screenIndex,
                                    actionIndex
                                  )
                                }
                              />
                              <label>{action}</label>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            ))}
          {collapse.includes(moduleIndex) &&
            module.screens.length > 0 &&
            module.screens.map((screen, screenIndex) => (
              <div key={screen.screenId}>
                <div
                  className="flex align-items-center"
                  style={{ marginLeft: "40px" }}
                >
                  <input
                    type="checkbox"
                    id={`screen-check-${screen.screenId}`}
                    checked={screen.isSelected}
                    onChange={(e) =>
                      handleCheckboxChange(e, moduleIndex, null, screenIndex)
                    }
                  />
                  <span>{screen.screenName}</span>
                </div>

                <div className="flex align-items-center">
                  {["Create", "Edit", "View", "Delete"].map(
                    (action, actionIndex) => (
                      <div key={actionIndex}>
                        <input
                          type="checkbox"
                          id={`action-check-${screen.screenId}-${actionIndex}`}
                          checked={screen.actions.includes(actionIndex + 1)}
                          onChange={(e) =>
                            handleCheckboxChange(
                              e,
                              moduleIndex,
                              null,
                              screenIndex,
                              actionIndex
                            )
                          }
                        />
                        <label>{action}</label>
                      </div>
                    )
                  )}
                </div>
              </div>
            ))}
        </div>
      ))}
    </>
  );
}
