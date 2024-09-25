import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "../NavBar";

const ProtectedLayout: React.FC = () => {
  return (
    <div>
      <NavBar />
      <div className="pt-[64px]">
        <Outlet />
      </div>
    </div>
  );
};

export default ProtectedLayout;
