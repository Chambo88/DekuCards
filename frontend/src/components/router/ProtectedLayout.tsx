import React from "react";
import NavBar from "../NavBar";
import AnimatedOutlet from "./AnimatedOutlet";

const ProtectedLayout: React.FC = () => {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <NavBar />
      <AnimatedOutlet />
    </div>
  );
};

export default ProtectedLayout;
