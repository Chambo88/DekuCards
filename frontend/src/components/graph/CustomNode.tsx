import { NodeProps, Handle, Position } from "reactflow";
import { Button } from "./../ui/button";
import FlashCardDialog from "../flashCardEditor/FlashCardDialog";
import { mockCardSet } from "@/models/cardSet";

const CustomNode = ({ data }: NodeProps) => {
  return (
    <div
      style={{
        padding: "10px",
        borderRadius: "5px",
        backgroundColor: data.selected ? "#A9A9A9" : "#1E90FF",
        color: "#FFFFFF",
        textAlign: "center",
        width: "150px",
      }}
    >
      {/* Add Handles */}
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />

      {/* Node label */}
      <div>{data.label}</div>

      <FlashCardDialog initialData={mockCardSet}>
        <Button variant="secondary" size="sm" className="mt-2">
          Edit {data.label}
        </Button>
      </FlashCardDialog>
    </div>
  );
};

export default CustomNode;
