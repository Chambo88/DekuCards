import { Outlet, Navigate } from "react-router-dom";
import useUserStore from "../../stores/useUserStore";

const AuthProtectedRoute = () => {
  const { user } = useUserStore();

  if (user === undefined) {
    return <div>Loadingv ...</div>;
  }

  if (!user) {
    return <Navigate to="/signup" replace />;
  }

  return <Outlet />;
};

export default AuthProtectedRoute;
