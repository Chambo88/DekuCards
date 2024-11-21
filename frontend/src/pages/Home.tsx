import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import AnimatedLayout from "@/components/router/AnimatedLayout";

const Home: React.FC = () => {
  return (
    <AnimatedLayout>
      <div className="dark:bg-blue-1000 relative flex min-h-screen items-end justify-center overflow-hidden bg-[url('src/assets/temp_bg_2.jpg')] bg-cover bg-center">
        <div className="mb-16 flex flex-col gap-4 md:flex-row">
          <Button className="w-56">Learn</Button>
          <Link to="/edit">
            <Button variant="outline" className="w-56">
              Edit
            </Button>
          </Link>
        </div>
      </div>
    </AnimatedLayout>
  );
};

export default Home;
