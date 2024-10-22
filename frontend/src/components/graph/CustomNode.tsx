import { NodeProps, Handle, Position } from "reactflow";
import { Button } from "./../ui/button";
import FlashCardEditor from "../flashCardEditor/FlashCardEditor";
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

      <FlashCardEditor cardSet={mockCardSet}>
        <Button variant="secondary" size="sm" className="mt-2">
          Edit {data.label}
        </Button>
      </FlashCardEditor>
    </div>
  );
};

export default CustomNode;
