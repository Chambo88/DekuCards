import React, {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
  useState,
  useMemo,
} from "react";
import ReactFlow, {
  Background,
  Controls,
  applyNodeChanges,
  applyEdgeChanges,
  Node,
  Edge,
  ConnectionLineType,
  useNodesState,
  useEdgesState,
  Position,
  ReactFlowInstance,
} from "reactflow";
import dagre from "dagre";
import "reactflow/dist/style.css";
import RightClickMenu from "./RightClickMenu";
import CustomNode from "./CustomNode";
import { FlashCardSet } from "@/models/models";
import { generateElements } from "./graphFunctions";

export interface GraphComponentHandle {
  resize: () => void;
}

interface GraphComponentProps {
  data: FlashCardSet[]; // Accepts the array of card sets
}

const nodeTypes = {
  custom: CustomNode,
};

const nodeWidth = 172;
const nodeHeight = 80;

//TODO Create child node from menu
//TODO Set parent in menu
//TODO Create new node
//TODO Delete node
//TODO Merge node (menu + drag and drop)
//TODO Node ui
//TODO save x, y
//TODO set parent (Drag from connector to another node)
//TODO draggable
//TODO enable disable moved to menu
//TODO default parent
//TODO expirement with dark mode

const GraphComponent = forwardRef<GraphComponentHandle, GraphComponentProps>(
  ({ data }, ref) => {
    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(
      null,
    );
    const [menuType, setMenuType] = useState<"node" | "pane" | null>(null);

    const { nodes: initialNodes, edges: initialEdges } = useMemo(
      () => generateElements(data),
      [data],
    );

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [menuCoords, setMenuCoords] = useState<{
      x: number;
      y: number;
    } | null>(null);

    useImperativeHandle(ref, () => ({
      resize() {
        if (rfInstance) {
          rfInstance.fitView();
        }
      },
    }));

    const handlePaneContextMenu = (event: React.MouseEvent) => {
      setMenuType("pane");

      if (rfInstance) {
        // Get the mouse position in the viewport
        const { clientX, clientY } = event;

        // Convert the mouse position to graph coordinates
        const { x, y } = rfInstance.screenToFlowPosition({
          x: clientX,
          y: clientY,
        });

        // Update the coordinates for the context menu in the graph's space
        setMenuCoords({ x: x - 15, y: y - 15 });
      }
    };

    const handleNodeContextMenu = (event: React.MouseEvent, node: any) => {
      setMenuType("node");
    };

    return (
      <div style={{ width: "100%", height: "100vh" }} ref={reactFlowWrapper}>
        <RightClickMenu
          menuType={menuType}
          cardSets={data}
          setNodes={setNodes}
          menuCoords={menuCoords}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            onPaneContextMenu={handlePaneContextMenu}
            onNodeContextMenu={handleNodeContextMenu}
            nodesConnectable={false}
            zoomOnScroll={true}
            fitView
            onInit={setRfInstance}
          >
            <Background />
            <Controls />
          </ReactFlow>
        </RightClickMenu>
      </div>
    );
  },
);

export default GraphComponent;
