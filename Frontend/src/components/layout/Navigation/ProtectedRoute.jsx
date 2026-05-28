import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuthStore from "../../../store/auth-store";
import { canAccessPath, getDefaultPath, isAuthenticated } from "../../../utils/access-control";

const ProtectedRoute = () => {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);

  if (!isAuthenticated(user, token)) {
    return <Navigate to="/" replace state={{ from: location.pathname }} />;
  }

  if (!canAccessPath(location.pathname, user, token)) {
    return <Navigate to={getDefaultPath(user)} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
