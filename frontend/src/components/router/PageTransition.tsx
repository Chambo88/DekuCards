import React from "react";
import { motion } from "framer-motion";
import { useNavigationType } from "react-router-dom";

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const navigationType = useNavigationType();
  const isBack = navigationType === "POP";

  const direction = isBack ? -1 : 1;

  const variants = {
    initial: { y: direction > 0 ? "100%" : "-100%" },
    animate: { y: "0%" },
    exit: { y: direction > 0 ? "-100%" : "100%" },
  };

  return (
    <motion.div
      className="absolute h-full w-full"
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
