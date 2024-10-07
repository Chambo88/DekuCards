import AnimatedLayout from "@/components/router/AnimatedLayout";
import { Link } from "react-router-dom";

const CardUI = () => {
  return (
    <AnimatedLayout>
      <div className="flex h-full w-full items-center justify-center bg-green-400">
        <Link to="/" className="btn">
          Go to Home
        </Link>
      </div>
    </AnimatedLayout>
  );
};

export default CardUI;
