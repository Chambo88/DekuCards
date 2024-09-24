import { Outlet, Navigate } from "react-router-dom";
import useAuthStore from "../../stores/useAuthStore";

const AuthProtectedRoute = () => {
  const { user } = useAuthStore();

  if (user === undefined) {
    // If user state is not yet determined, you might want to show a loading indicator
    return <div>Loadingv ...</div>;
  }

  if (!user) {
    // User is not authenticated, redirect to SignUp
    return <Navigate to="/signup" replace />;
  }

  // User is authenticated, render the protected component
  return <Outlet />;
};

export default AuthProtectedRoute;
