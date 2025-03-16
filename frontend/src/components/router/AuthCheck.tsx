import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import useUserStore from "../../stores/useUserStore";

const AuthCheck: React.FC = () => {
  const { user } = useUserStore();

  if (user === undefined) {
    return <div>Loading...</div>;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AuthCheck;
