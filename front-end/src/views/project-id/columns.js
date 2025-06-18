const columns = [
  {
    property: "projectId",
    label: "Project ID",
    sortable: true,
  },
  {
    property: "name",
    label: "Project name",
    sortable: true,
  },
  {
    property: "hydroPowerName",
    label: "Plant name",
    sortable: true,
  },
  {
    property: "type",
    label: "Project type",
    sortable: true,
  },
  {
    align: "right",
    slot: true,
    name: "actions",
    label: "Actions",
  },
];

export default columns;
