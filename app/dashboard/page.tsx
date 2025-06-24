const newDashboardEnabled =
  process.env.NEXT_PUBLIC_NEW_DASHBOARD === "true";

export { default } from newDashboardEnabled
  ? "./page-new"
  : "./page-legacy";
