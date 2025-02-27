import { Set } from "@/models/models";
import { Edge, Node, Position } from "reactflow";

export const generateElements = (cardSets: Record<string, Set>) => {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  for (const cardSet of Object.values(cardSets)) {
    nodes.push({
      id: cardSet.id,
      data: {
        cardSet: cardSet,
        selected: false,
      },
      position: { x: cardSet.position_x, y: cardSet.position_y },
      draggable: true,
      type: "custom",
      targetPosition: Position.Top,
      sourcePosition: Position.Bottom,
    });

    if (cardSet.parent_id) {
      edges.push({
        id: `edge-${cardSet.parent_id}-${cardSet.id}`,
        source: cardSet.parent_id,
        target: cardSet.id,
      });
    }
  }

  console.log("reran");

  return { nodes, edges };
};
