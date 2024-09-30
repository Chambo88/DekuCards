import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "../NavBar";

const ProtectedLayout: React.FC = () => {
  return (
    <div className="relative">
      <NavBar />
      <Outlet />
    </div>
  );
};

export default ProtectedLayout;
