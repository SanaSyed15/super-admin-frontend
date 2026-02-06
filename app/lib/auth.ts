export const isAuthenticated = () => {
  if (typeof window === "undefined") return false;

  const token = localStorage.getItem("superadmin_token");
  const role = localStorage.getItem("role");

  if (!token || role !== "SUPER_ADMIN") {
    return false;
  }

  return true;
};
