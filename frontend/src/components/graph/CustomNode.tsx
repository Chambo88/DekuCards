import { NodeProps, Handle, Position } from "reactflow";
import { Button } from "./../ui/button";
import FlashCardDialog from "../flashCardEditor/FlashCardDialog";
import { mockCardSet } from "@/models/models";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";

const CustomNode = ({ data }: NodeProps) => {
  return (
    <div
      className={`h-full rounded-[1.5rem] bg-muted p-2.5 text-center text-white ${data.selected ? "opacity-50" : "opacity-100"} border-2 border-green-400`}
    >
      <div className={`flex h-full items-center justify-between`}>
        <div className="ml-2">{data.label}</div>

        <FlashCardDialog initialData={mockCardSet}>
          <EllipsisVerticalIcon className="h-6 w-6" />
        </FlashCardDialog>
      </div>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default CustomNode;
