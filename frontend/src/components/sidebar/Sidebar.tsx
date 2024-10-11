import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import {
  Square2StackIcon,
  ChartBarIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";
import {
  Tooltip,
  TooltipProvider,
  TooltipContent,
  TooltipTrigger,
} from "../ui/tooltip";

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState("explorer");
  const { width, handleMouseDown } = useResizable(250, 100, 500);

  const tabs = [
    {
      id: "manager",
      icon: <Square2StackIcon className="h-7 w-7" />,
      label: "Card Manager",
    },
    {
      id: "community",
      icon: <GlobeAltIcon className="h-7 w-7" />,
      label: "Community cards",
    },
    {
      id: "analytics",
      icon: <ChartBarIcon className="h-7 w-7" />,
      label: "Analytics",
    },
  ];

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex h-screen w-full">
        {/* Left Icon Bar */}
        <div className="flex w-14 flex-col items-center border-r border-t bg-card py-4">
          {tabs.map((tab) => (
            <Tooltip key={tab.id}>
              <TooltipTrigger asChild>
                <Button
                  key={tab.id}
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "relative w-full justify-center rounded-none px-4 py-7 text-muted-foreground",
                    activeTab === tab.id && "text-foreground",
                  )}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <span
                    className={cn(
                      "absolute left-0 h-full w-1 bg-transparent transition-all",
                      activeTab === tab.id && "bg-accent",
                    )}
                  />
                  {tab.icon}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" align="center">
                <p>{tab.label}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>

        {/* Main Sidebar */}
        <div
          className="border-t bg-background"
          style={{ width: `${width}px` }} // Dynamic sidebar width
        >
          {activeTab === "manager" && <div>Manager Content</div>}
          {activeTab === "community" && <div>Community Content</div>}
          {activeTab === "analytics" && <div>Analytics Content</div>}
        </div>

        {/* Resizer */}
        <div
          onMouseDown={handleMouseDown}
          className="flex cursor-col-resize justify-center px-1 transition-all duration-300 ease-in-out hover:bg-border"
        >
          <div className="w-px bg-border"></div>
        </div>
      </div>
    </TooltipProvider>
  );
};
export default Sidebar;

const useResizable = (initialWidth = 250, minWidth = 100, maxWidth = 500) => {
  const [width, setWidth] = useState(initialWidth);
  const isResizing = useRef(false);
  const iconBarWidth = 60;

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    isResizing.current = true;
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing.current) return;

    const newWidth = e.clientX - iconBarWidth;
    if (newWidth >= minWidth && newWidth <= maxWidth) {
      setWidth(newWidth);
    }
  };

  const handleMouseUp = () => {
    isResizing.current = false;
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return {
    width,
    handleMouseDown,
  };
};
