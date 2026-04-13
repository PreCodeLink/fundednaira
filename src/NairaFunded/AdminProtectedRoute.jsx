import { Navigate, Outlet } from "react-router-dom";

const AdminProtectedRoute = () => {
  let user = null;

  try {
    const rawUser = localStorage.getItem("user");
    user = rawUser ? JSON.parse(rawUser) : null;
  } catch (error) {
    console.error("Invalid user in storage");
    user = null;
  }

  // ❌ Not logged in
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // ❌ Not admin
  if (String(user.role).toLowerCase() !== "admin") {
    return <Navigate to="/" replace />;
  }

  // ✅ Admin allowed
  return <Outlet />;
};

export default AdminProtectedRoute;