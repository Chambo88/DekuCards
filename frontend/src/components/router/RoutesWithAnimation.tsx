import React from "react";
import { useLocation, Outlet } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

const RoutesWithAnimation: React.FC = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Outlet key={location.pathname} />
    </AnimatePresence>
  );
};

export default RoutesWithAnimation;
