import { NodeProps, Handle, Position } from "reactflow";
import { memo, useRef } from "react";
import { Button } from "./../ui/button";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import RightClickMenu from "./RightClickMenu";

const CustomNode = ({ data }: NodeProps) => {
  const divRef = useRef<HTMLDivElement>(null);

  const handleLeftClick = (e: React.MouseEvent) => {
    if (divRef.current) {
      // Create and dispatch the contextmenu event
      const event = new MouseEvent("contextmenu", {
        bubbles: true,
        cancelable: true,
        view: window,
        clientX: e.clientX,
        clientY: e.clientY,
      });
      divRef.current.dispatchEvent(event);
    }
  };

  return (
    <div
      className={`h-full rounded-[1.5rem] border-2 border-green-400 bg-muted p-2.5 text-center text-white`}
      ref={divRef}
    >
      <div className={`flex h-full items-center justify-between`}>
        <div className="ml-2">{data.label}</div>
        <Button
          variant="outline"
          size="icon"
          onClick={handleLeftClick}
          className="bg-transparent hover:bg-black/30"
        >
          <EllipsisVerticalIcon className="h-6 w-6" />
        </Button>
      </div>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default memo(CustomNode);
