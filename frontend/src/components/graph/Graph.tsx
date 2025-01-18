import React, {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
  useState,
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

export interface GraphComponentHandle {
  resize: () => void;
}

const nodeTypes = {
  custom: CustomNode,
};

const nodeWidth = 172;
const nodeHeight = 80;

//TODO button on node opens menu
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

const getLayoutedElements = (nodes: Node[], edges: Edge[]) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const isHorizontal = true; // For Top-to-Bottom layout
  dagreGraph.setGraph({
    rankdir: isHorizontal ? "TB" : "LR",
    ranksep: 150,
    nodesep: 25,
  });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    };
    node.targetPosition = Position.Top;
    node.sourcePosition = Position.Bottom;
    node.style = {
      ...node.style,
      width: nodeWidth,
      height: nodeHeight,
    };
  });

  return { nodes, edges };
};

const generateElements = (numNodes: number) => {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  for (let i = 1; i <= numNodes; i++) {
    nodes.push({
      id: `${i}`,
      data: { label: `Node ${i}`, selected: false },
      position: { x: 0, y: 0 },
      draggable: true,
      type: "custom",
    });
  }

  for (let i = 1; i <= Math.floor(numNodes / 2); i++) {
    const child1 = 2 * i;
    const child2 = 2 * i + 1;

    if (child1 <= numNodes) {
      edges.push({
        id: `e${i}-${child1}`,
        source: `${i}`,
        target: `${child1}`,
        type: "smoothstep",
        animated: false,
        style: { stroke: "#A9A9A9" },
      });
    } else {
      console.warn(
        `Skipping edge creation: child1 (${child1}) exceeds numNodes`,
      );
    }

    if (child2 <= numNodes) {
      edges.push({
        id: `e${i}-${child2}`,
        source: `${i}`,
        target: `${child2}`,
        type: "smoothstep",
        animated: false,
        style: { stroke: "#A9A9A9" },
      });
    } else {
      console.warn(
        `Skipping edge creation: child2 (${child2}) exceeds numNodes`,
      );
    }
  }

  return getLayoutedElements(nodes, edges);
};

const GraphComponent = forwardRef<GraphComponentHandle>((props, ref) => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);
  const [menuType, setMenuType] = useState<"node" | "pane" | null>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(
    generateElements(10).nodes,
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    generateElements(10).edges,
  );

  useImperativeHandle(ref, () => ({
    resize() {
      if (rfInstance) {
        rfInstance.fitView();
      }
    },
  }));

  const handlePaneContextMenu = (event: React.MouseEvent) => {
    setMenuType("pane");
  };

  const handleNodeContextMenu = (event: React.MouseEvent, node: any) => {
    setMenuType("node");
  };

  return (
    <div style={{ width: "100%", height: "100vh" }} ref={reactFlowWrapper}>
      <RightClickMenu menuType={menuType}>
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
});

export default GraphComponent;
