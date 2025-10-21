import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({ isAllowed, redirectPath = "/user" }) {
  if (!isAllowed) {
    return <Navigate to={redirectPath} replace />;
  }
  return <Outlet />;
}
