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
  Position,
  ReactFlowInstance,
} from "reactflow";
import dagre from "dagre";
import "reactflow/dist/style.css";
import CustomNode from "./CustomNode";

export interface GraphComponentHandle {
  resize: () => void;
}

const nodeTypes = {
  custom: CustomNode,
};

const nodeWidth = 172;
const nodeHeight = 80;

//TODO right click add dialog thing on background (OnPaneContextMenu)
//TODO right click on node opens menu
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

const GraphComponent = forwardRef<GraphComponentHandle>((props, ref) => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);

  const numNodes = 15;

  const generateElements = (numNodes: number) => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    for (let i = 1; i <= numNodes; i++) {
      nodes.push({
        id: `${i}`,
        data: { label: `Node ${i}`, selected: false },
        position: { x: 0, y: 0 },
        draggable: false,
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

  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  useImperativeHandle(ref, () => ({
    resize() {
      if (rfInstance) {
        rfInstance.fitView();
      }
    },
  }));

  useEffect(() => {
    const { nodes: layoutedNodes, edges: layoutedEdges } =
      generateElements(numNodes);
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  }, []);

  const onNodeClick = (event: React.MouseEvent, node: Node) => {
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === node.id) {
          const selected = n.data.selected;
          n.data = {
            ...n.data,
            selected: !selected,
          };
        }
        return n;
      }),
    );
  };

  return (
    <div style={{ width: "100%", height: "100vh" }} ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={(changes) =>
          setNodes((nds) => applyNodeChanges(changes, nds))
        }
        onEdgesChange={(changes) =>
          setEdges((eds) => applyEdgeChanges(changes, eds))
        }
        onNodeClick={onNodeClick}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        zoomOnScroll={true}
        panOnDrag={true}
        fitView
        onInit={setRfInstance}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
});

export default GraphComponent;
