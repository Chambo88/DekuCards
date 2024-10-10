import AnimatedLayout from "@/components/router/AnimatedLayout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronUpIcon } from "@heroicons/react/24/outline";
import GraphComponent, { GraphComponentHandle } from "@/components/Graph";
import { useRef } from "react";
import Sidebar from "@/components/sidebar/Sidebar";

const CardUI = () => {
  const graphRef = useRef<GraphComponentHandle>(null);

  // Function to handle animation completion
  const handleAnimationComplete = () => {
    if (graphRef.current) {
      graphRef.current.resize();
    }
  };
  return (
    <AnimatedLayout onAnimationComplete={handleAnimationComplete}>
      <div className="relative h-screen w-screen">
        <div className="absolute left-2/4 z-10 mt-5">
          <Link to="/">
            <Button
              variant="outline"
              className="rounded-full bg-transparent p-1"
            >
              <ChevronUpIcon className="h-8 w-8 text-white" />
            </Button>
          </Link>
        </div>
        <div className="absolute z-20 w-full"></div>
        <div className="flex">
          <div className="h-full">
            <Sidebar />
          </div>
          <GraphComponent ref={graphRef} />
        </div>
      </div>
    </AnimatedLayout>
  );
};

export default CardUI;
