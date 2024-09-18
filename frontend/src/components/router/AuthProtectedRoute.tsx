import { Outlet } from "react-router-dom";
import SignUp from "../../pages/Login";
import useAuthStore from "../../stores/useAuthStore";
import useAuthService from "../../services/useAuthService";

const AuthProtectedRoute = () => {
  const { user } = useAuthStore();
  const { isLoading } = useAuthService(); // Get loading state from the hook

  if (isLoading) {
    return <div className="bg-green-500">Loading...</div>;
  }

  if (!user) {
    console.log("We have no user!");
    return <SignUp />;
  }

  console.log("We have a user!");
  return <Outlet />;
};

export default AuthProtectedRoute;
