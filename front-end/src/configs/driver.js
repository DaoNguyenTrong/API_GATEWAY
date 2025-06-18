export const driverIds = {
  logo: "sidebar-logo",
  sidebar: "sidebar",
};

export const driverSteps = [
  {
    element: `#${driverIds.logo}`,
    popover: {
      title: "Title on Popover",
      description: "Body of the popover",
      position: "left",
    },
  },
  {
    element: `#${driverIds.sidebar}`,
    popover: {
      title: "Title on Popover",
      description: "Body of the popover",
      position: "left",
    },
  },
];
