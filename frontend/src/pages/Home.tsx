import React from "react";
import { Button } from "@/components/ui/button";

const Home: React.FC = () => {
  return (
    <div className="relative flex min-h-screen flex-col justify-end gap-20 overflow-hidden">
      <Button>Button</Button>
      <Button variant="outline">Outline</Button>
    </div>
  );
};

export default Home;
