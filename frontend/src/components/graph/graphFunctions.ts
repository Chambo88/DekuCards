import { DekuNode } from "@/models/models";
import { Edge, Node, Position } from "reactflow";

export const generateElements = (dekuNodes: Record<string, DekuNode>) => {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  for (const dekuNode of Object.values(dekuNodes)) {
    // TODO Add grouping features etc.
    if (Object.keys(dekuNode.sets).length == 0) {
      continue;
    }
    let tempSet = Object.values(dekuNode.sets)[0]
    nodes.push({
      id: dekuNode.id,
      data: {
        cardSet: tempSet,
        selected: false,
      },
      position: { x: dekuNode.position_x, y: dekuNode.position_y },
      draggable: true,
      type: "custom",
      targetPosition: Position.Top,
      sourcePosition: Position.Bottom,
    });

    if (dekuNode.parent_node_id) {
      edges.push({
        id: `edge-${dekuNode.parent_node_id}-${dekuNode.id}`,
        source: dekuNode.parent_node_id,
        target: dekuNode.id,
      });
    }
  }

  console.log("reran");

  return { nodes, edges };
};
