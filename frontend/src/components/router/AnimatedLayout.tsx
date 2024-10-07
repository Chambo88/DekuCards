import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";

interface AnimatedLayoutProps {
  children: React.ReactNode;
}

const AnimatedLayout: React.FC<AnimatedLayoutProps> = ({ children }) => {
  const location = useLocation();

  const getVariants = () => {
    if (location.pathname === "/edit") {
      return {
        initial: { y: "100%" },
        animate: { y: "0%" },
        exit: { y: "-100%" },
      };
    } else if (location.pathname === "/") {
      return {
        initial: { y: "-100%" },
        animate: { y: "0%" },
        exit: { y: "100%" },
      };
    }
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    };
  };

  return (
    <motion.div
      className="absolute inset-0"
      variants={getVariants()}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedLayout;
