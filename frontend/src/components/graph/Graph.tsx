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
  Node,
  useNodesState,
  useEdgesState,
  ReactFlowInstance,
} from "reactflow";
import "reactflow/dist/style.css";
import RightClickMenu from "./RightClickMenu";
import CustomNode from "./CustomNode";
import { generateElements } from "./graphFunctions";
import useCardSetStore from "@/stores/useCardStore";

export interface GraphComponentHandle {
  resize: () => void;
}

const nodeTypes = {
  custom: CustomNode,
};

interface GraphComponentProps {
  data?: any;
}

const GraphComponent = forwardRef<GraphComponentHandle, GraphComponentProps>(
  (props, ref) => {
    const cardSetsById = useCardSetStore((state) => state.cardSetsById);
    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(
      null,
    );
    // menuType indicates whether we’re showing a node menu or a pane menu
    const [menuType, setMenuType] = useState<"node" | "pane" | null>(null);
    // menuCoords holds the client (screen) coordinates where the menu should appear
    const [menuCoords, setMenuCoords] = useState<{
      x: number;
      y: number;
    } | null>(null);
    // clickedNode is used for node-specific actions
    const [clickedNode, setClickedNode] = useState<Node | null>(null);

    const { nodes: initialNodes, edges: initialEdges } = useMemo(
      () => generateElements(cardSetsById),
      [cardSetsById],
    );

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    useImperativeHandle(ref, () => ({
      resize() {
        if (rfInstance) {
          rfInstance.fitView();
        }
      },
    }));

    const handlePaneContextMenu = (event: React.MouseEvent) => {
      event.preventDefault();
      setClickedNode(null);
      setMenuType("pane");

      if (rfInstance) {
        // Here we use the event’s client coordinates for the menu position.
        const { clientX, clientY } = event;
        setMenuCoords({ x: clientX, y: clientY });
      }
      console.log(menuCoords, menuType);
    };

    const handleNodeContextMenu = (event: React.MouseEvent, node: Node) => {
      event.preventDefault();
      setClickedNode(node);
      setMenuType("node");

      const { clientX, clientY } = event;
      setMenuCoords({ x: clientX, y: clientY });
      console.log(menuCoords, menuType);
    };

    // Close the context menu if the user clicks anywhere else.
    useEffect(() => {
      const handleClickOutside = () => {
        console.log(menuCoords, menuType);
        if (menuType) {
          setMenuCoords(null);
          setMenuType(null);
          setClickedNode(null);
        }
      };

      document.addEventListener("click", handleClickOutside);
      return () => {
        document.removeEventListener("click", handleClickOutside);
      };
    }, [menuType]);

    return (
      // Set position: relative so that the context menu (absolute positioned) is relative to this container.
      <div
        style={{ width: "100%", height: "100vh", position: "relative" }}
        ref={reactFlowWrapper}
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

        {/* Render the right-click menu if coordinates and type are set */}
        {menuCoords && menuType && (
          <RightClickMenu
            x={menuCoords.x}
            y={menuCoords.y}
            menuType={menuType}
            clickedNode={clickedNode || undefined}
            setNodes={setNodes}
            setEdges={setEdges}
            onClose={() => {
              setMenuCoords(null);
              setMenuType(null);
              setClickedNode(null);
            }}
          />
        )}
      </div>
    );
  },
);

export default GraphComponent;
