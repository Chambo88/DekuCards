import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import useUserStore from "../../stores/useUserStore";

const AuthCheck: React.FC = () => {
  const user = useUserStore((state) => state.user);
  const isInit = useUserStore((state) => state.isLoaded);

  if (user === null) {
    return <Outlet />;
  }

  if (user === undefined || isInit == false) {
    return <div>Loading...</div>;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AuthCheck;
