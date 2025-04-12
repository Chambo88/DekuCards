import { Edge, Node, Position } from "reactflow";
import useCardSetStore from "@/stores/useTreeStore";


export const generateElements = () => {
  let dekuNodes = useCardSetStore.getState().dekuNodes
  let dekuSets = useCardSetStore.getState().dekuSets
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  console.log("the nodes are")
  console.log(JSON.stringify(dekuNodes));
  console.log(JSON.stringify(dekuSets));

  // TODO Add grouping features etc.

  for (const dekuSet of Object.values(dekuSets)) {
    nodes.push({
      id: dekuSet.id,
      data: {
        cardSet: dekuSet,
        selected: false,
      },
      position: { x: dekuNodes[dekuSet.parent_node_id].position_x, y: dekuNodes[dekuSet.parent_node_id].position_y },
      draggable: true,
      type: "custom",
      targetPosition: Position.Top,
      sourcePosition: Position.Bottom,
    });

    //TODO fix edges
    // if (dekuSet.parent_node_id) {
    //   edges.push({
    //     id: `edge-${dekuSet.parent_node_id}-${dekuSet.id}`,
    //     source: dekuSet.parent_node_id,
    //     target: dekuSet.id,
    //   });
    // }
  }

  console.log(nodes)

  console.log("Generated elements");

  return { nodes, edges };
};
