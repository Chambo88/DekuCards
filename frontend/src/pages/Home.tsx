import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import AnimatedLayout from "@/components/router/AnimatedLayout";
import LearnDialog from "@/components/learn/Learn";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

const Home: React.FC = () => {
  return (
    <AnimatedLayout>
      <div className="dark:bg-blue-1000 relative flex min-h-screen items-end justify-center overflow-hidden bg-[url('src/assets/temp_bg_6.png')] bg-center">
        <div className="mb-16 flex flex-col gap-4 md:flex-row">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-56">Learn</Button>
            </DialogTrigger>
            <LearnDialog />
          </Dialog>
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
