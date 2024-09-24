import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import useAuthStore from "../../stores/useAuthStore";

const AuthCheck: React.FC = () => {
  const { user } = useAuthStore();

  if (user === undefined) {
    return <div>Loading...</div>;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AuthCheck;
