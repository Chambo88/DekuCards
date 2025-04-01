import { create } from "zustand";
import { DekuNode, DekuSet } from "@/models/models";

interface TreeState {
  dekuNodes: Record<string, DekuNode>;
  dekuSets: Record<string, DekuSet>;
  updateNode: (nodeId: string, updates: Partial<DekuNode>) => void;
  updateSet: (setId: string, updates: Partial<DekuSet>) => void;
}

export const useNodeStore = create<TreeState>((set) => ({
  dekuNodes: {},
  dekuSets: {},
  updateNode: (nodeId, updates) =>
    set((state) => ({
      dekuNodes: {
        ...state.dekuNodes,
        [nodeId]: { ...state.dekuNodes[nodeId], ...updates },
      },
  })),
  updateSet: (setId, updates) =>
    set((state) => ({
      dekuSets: {
        ...state.dekuSets,
        [setId]: { ...state.dekuSets[setId], ...updates },
      },
  })),
}));

export default useNodeStore;
