// GraphComponent.tsx
import React, {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
import CytoscapeComponent from "react-cytoscapejs";
import cytoscape, {
  Core,
  Stylesheet,
  LayoutOptions,
  ElementDefinition,
  EventObjectNode,
} from "cytoscape";

export interface GraphComponentHandle {
  resize: () => void;
}

const GraphComponent = forwardRef<GraphComponentHandle>((props, ref) => {
  const cyRef = useRef<Core | null>(null);

  const numNodes = 15; // Set the number of nodes here

  // Function to generate nodes and edges dynamically
  const generateElements = (numNodes: number): ElementDefinition[] => {
    const elements: ElementDefinition[] = [];
    const edges: ElementDefinition[] = [];

    // Create nodes
    for (let i = 1; i <= numNodes; i++) {
      elements.push({
        data: { id: `${i}`, label: `Node ${i}`, selected: false },
      });
    }

    // Create edges based on parent-child relationships
    for (let i = 1; i <= Math.floor(numNodes / 2); i++) {
      const child1 = 2 * i;
      const child2 = 2 * i + 1;

      if (child1 <= numNodes) {
        edges.push({
          data: { source: `${i}`, target: `${child1}` },
        });
      }

      if (child2 <= numNodes) {
        edges.push({
          data: { source: `${i}`, target: `${child2}` },
        });
      }
    }

    return [...elements, ...edges];
  };

  const elements: ElementDefinition[] = generateElements(numNodes);

  // Stylesheet for nodes and edges
  const stylesheet: Stylesheet[] = [
    {
      selector: "node",
      style: {
        shape: "roundrectangle",
        width: "label",
        height: "label",
        label: "data(label)",
        "text-valign": "center",
        "text-halign": "center",
        "background-color": (ele) =>
          ele.data("selected") ? "#A9A9A9" : "#1E90FF", // Grey if selected
        color: "#FFFFFF",
        "font-size": 14,
        padding: "10px",
      },
    },
    {
      selector: "edge",
      style: {
        width: 2,
        "line-color": "#A9A9A9",
        "target-arrow-color": "#A9A9A9",
        "target-arrow-shape": "triangle",
        "curve-style": "round-taxi",
        "taxi-direction": "downward",
        "taxi-turn": 60,
        "taxi-turn-min-distance": 5,
        "taxi-radius": 50,
      },
    },
  ];

  // Layout to arrange nodes hierarchically
  const layout: LayoutOptions = {
    name: "breadthfirst",
    directed: true,
    padding: 10,
    spacingFactor: 1.5,
    animate: false,
  };

  useImperativeHandle(ref, () => ({
    resize() {
      if (cyRef.current) {
        cyRef.current.resize();
        // Optionally re-run the layout if needed
        // cyRef.current.layout(layout).run();
      }
    },
  }));

  useEffect(() => {
    const cy = cyRef.current;
    if (cy) {
      // Disable node dragging
      cy.nodes().ungrabify();

      // Enable graph panning and zooming
      cy.userZoomingEnabled(true);
      cy.userPanningEnabled(true);

      // Add event listener for node clicks
      cy.on("tap", "node", (event: EventObjectNode) => {
        const node = event.target;
        // Toggle the 'selected' data attribute
        const currentSelected = node.data("selected");
        node.data("selected", !currentSelected);
        // Update the node style
        node.style(
          "background-color",
          !currentSelected ? "#A9A9A9" : "#1E90FF",
        );
      });
    }

    // Cleanup event listener on unmount
    return () => {
      if (cy) {
        cy.off("tap", "node");
      }
    };
  }, []);

  return (
    <CytoscapeComponent
      elements={elements}
      stylesheet={stylesheet}
      layout={layout}
      wheelSensitivity={0.2}
      cy={(cy: Core) => {
        cyRef.current = cy;
      }}
      style={{ width: "100%", height: "100vh" }}
    />
  );
});

export default GraphComponent;
