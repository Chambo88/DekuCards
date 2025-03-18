import { Outlet, Navigate } from "react-router-dom";
import useUserStore from "../../stores/useUserStore";

const AuthProtectedRoute = () => {
  const user = useUserStore((state) => state.user);
  const isInit = useUserStore((state) => state.isLoaded);

  if (!user) {
    return <Navigate to="/signup" replace />;
  }

  if (user === undefined || isInit === false) {
    return <div>Loadingv ...</div>;
  }

  return <Outlet />;
};

export default AuthProtectedRoute;
