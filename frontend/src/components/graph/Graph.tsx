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
  Viewport,
} from "reactflow";
import "reactflow/dist/style.css";
import RightClickMenu from "./RightClickMenu";
import CustomNode from "./CustomNode";
import { generateElements } from "./graphFunctions";
import useCardSetStore from "@/stores/useCardStore";
import useCardEditService from "@/services/useSetService";
import { Set } from "@/models/models";

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
    const { updateSet } = useCardEditService();
    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(
      null,
    );
    const [menuType, setMenuType] = useState<"node" | "pane" | null>(null);
    const [menuCoords, setMenuCoords] = useState<{
      x: number;
      y: number;
    } | null>(null);
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

      console.log("setting to ");

      setClickedNode(null);
      setMenuType("pane");

      if (rfInstance) {
        const { clientX, clientY } = event;
        setMenuCoords({ x: clientX, y: clientY });
      }
    };

    const handleNodeContextMenu = (event: React.MouseEvent, node: Node) => {
      event.preventDefault();
      setClickedNode(node);
      setMenuType("node");

      const { clientX, clientY } = event;
      setMenuCoords({ x: clientX, y: clientY });
      console.log("who we login");
      console.log(JSON.stringify(node));
    };

    const onNodeDragStop = (
      event: React.MouseEvent | React.TouchEvent | null,
      node: Node<any, string | undefined>,
    ) => {
      if (node) {
        const cardSet: Set = node.data.cardSet;

        updateSet(
          cardSet.id,
          {
            position_x: node.position.x,
            position_y: node.position.y,
          },
          false,
        );
      }
    };

    return (
      <div
        style={{ width: "100%", height: "100vh", position: "relative" }}
        ref={reactFlowWrapper}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeDragStop={onNodeDragStop}
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

        <RightClickMenu
          menuCoords={menuCoords}
          menuType={menuType}
          clickedNode={clickedNode}
          setNodes={setNodes}
          setEdges={setEdges}
          onClose={() => {
            setMenuCoords(null);
            setMenuType(null);
          }}
        />
      </div>
    );
  },
);

export default GraphComponent;
