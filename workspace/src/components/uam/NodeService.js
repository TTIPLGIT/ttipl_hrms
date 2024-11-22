const uam = [
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
];

// Helper function to map uam to tree node structure
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
            key: `action-${screen.screenId}-${action}`,
            label: `Action ${action}`,
            data: `Action ${action} for screen ${screen.screenId}`,
          })),
        })),
      })),
      ...module.screens.map((screen) => ({
        key: `screen-${screen.screenId}`,
        label: screen.screenName,
        data: `Screen ${screen.screenId}`,
        children: screen.actions.map((action) => ({
          key: `action-${screen.screenId}-${action}`,
          label: `Action ${action}`,
          data: `Action ${action} for screen ${screen.screenId}`,
        })),
      })),
    ],
  }));
};

const treeNodes = mapUamToTreeNodes(uam);

export { treeNodes };
// Use treeNodes as needed, for example:
console.log(treeNodes);
