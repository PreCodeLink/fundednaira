import { Navigate, Outlet } from "react-router-dom";

const StaffProtectedRoute = () => {
  const token = localStorage.getItem("staff_token");

  return token ? <Outlet /> : <Navigate to="/auth/staff" replace />;
};

export default StaffProtectedRoute;