import { NodeProps, Handle, Position } from "reactflow";
import { memo, useRef } from "react";
import { Button } from "./../ui/button";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { FlashCardSet } from "@/models/models";

const CustomNode = ({ data }: NodeProps) => {
  const divRef = useRef<HTMLDivElement>(null);
  const cardSet: FlashCardSet = data.cardSet;

  const handleLeftClick = (e: React.MouseEvent) => {
    if (divRef.current) {
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
      <div className={`flex h-full items-center justify-between p-2`}>
        <div className="mx-2">{cardSet.title}</div>
        <Button
          variant="outline"
          size="icon"
          onClick={handleLeftClick}
          className="bg-transparent hover:bg-black/30"
        >
          <EllipsisVerticalIcon className="h-6 w-6" />
        </Button>
      </div>
      {cardSet.parent_id && <Handle type="target" position={Position.Top} />}
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default memo(CustomNode);
