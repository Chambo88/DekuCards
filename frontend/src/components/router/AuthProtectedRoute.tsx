import { Outlet, Navigate } from "react-router-dom";
import useAuthStore from "../../stores/useAuthStore";

const AuthProtectedRoute = () => {
  const { user } = useAuthStore();

  if (user === undefined) {
    return <div>Loadingv ...</div>;
  }

  if (!user) {
    return <Navigate to="/signup" replace />;
  }

  return <Outlet />;
};

export default AuthProtectedRoute;
