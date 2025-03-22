import { create } from "zustand";
import { DekuNode, DekuSet } from "@/models/models";

interface TreeState {
  nodes: Record<string, DekuNode>;
  updateNode: (id: string, updates: Partial<DekuNode>) => void;
  updateSet: (nodeId: string, setId: string, updates: Partial<DekuSet>) => void;
}

export const useNodeStore = create<TreeState>((set) => ({
  nodes: {},
  updateNode: (id, updates) =>
    set((state) => ({
      nodes: {
        ...state.nodes,
        [id]: { ...state.nodes[id], ...updates },
      },
    })),
    updateSet: (nodeId, setId, updates) => set((state) => ({
      nodes: {
        ...state.nodes,
        [nodeId]: {
          ...state.nodes[nodeId],
          sets: {
            ...state.nodes[nodeId].sets,
            [setId]: { ...state.nodes[nodeId].sets[setId], ...updates }
          }
        }
      }
    }))
}));

export default useNodeStore;
