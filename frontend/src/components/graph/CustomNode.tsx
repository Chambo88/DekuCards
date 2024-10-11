import { NodeProps } from "reactflow";
import { Button } from "./../ui/button";
import { DialogTrigger } from "@radix-ui/react-dialog";

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
      {/* Node label */}
      <div>{data.label}</div>

      {/* Button at the bottom */}
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm" className="mt-2">
          Edit {data.label}
        </Button>
      </DialogTrigger>
    </div>
  );
};

export default CustomNode;
