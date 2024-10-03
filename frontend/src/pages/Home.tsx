import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  return (
    <div className="dark:bg-blue-1000 bg- relative flex min-h-screen items-end justify-center overflow-hidden">
      <div className="mb-16 flex flex-col gap-4 md:flex-row">
        <Button className="w-56">Button</Button>
        <Link to="/edit">
          <Button variant="outline" className="w-56">
            Outline
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
