import { create } from "zustand";
import { DekuNode, DekuSet, FlashCard } from "@/models/models";

interface TreeState {
  dekuNodes: Record<string, DekuNode>;
  dekuSets: Record<string, DekuSet>;
  setToCards: Record<string, Record<string, FlashCard>>;
  updateNode: (nodeId: string, updates: Partial<DekuNode>) => void;
  updateSet: (setId: string, updates: Partial<DekuSet>) => void;
  addCards: (setId: string, newCards: Record<string, FlashCard>) => void;
  updateCard: (setId: string, cardId: string, updates: Partial<FlashCard>) => void;
  deleteCards: (setId: string, cardIds: Set<string>) => void;
  initSets: (sets: Record<string, DekuSet>) => void;
  initNodes: (nodes: Record<string, DekuNode>) => void;
  initCards: (cards: Record<string, Record<string, FlashCard>>) => void;
}

export const useTreeStore = create<TreeState>((set) => ({
  dekuNodes: {},
  dekuSets: {},
  setToCards: {},

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

  addCards: (setId, newCards) =>
    set((state) => ({
      setToCards: {
        ...state.setToCards,
        [setId]: {
          ...(state.setToCards[setId] || {}),
          ...newCards,
        },
      },
    })),

  updateCard: (setId, cardId, updates) =>
    set((state) => ({
      setToCards: {
        ...state.setToCards,
        [setId]: {
          ...state.setToCards[setId],
          [cardId]: {
            ...state.setToCards[setId]?.[cardId],
            ...updates,
          },
        },
      },
    })),

  deleteCards: (setId, cardIds) =>
    set((state) => {
      const currentCards = state.setToCards[setId] ?? {};
      const updatedCards: Record<string, FlashCard> = {};

      for (const [cardId, card] of Object.entries(currentCards)) {
        if (!cardIds.has(cardId)) {
          updatedCards[cardId] = card;
        }
      }

      return {
        setToCards: {
          ...state.setToCards,
          [setId]: updatedCards,
        },
      };
    }),

  initSets: (sets) =>
    set(() => ({
      dekuSets: sets,
    })),

  initNodes: (nodes) =>
    set(() => ({
      dekuNodes: nodes,
    })),

  initCards: (cards) =>
    set(() => ({
      setToCards: cards,
    })),
}));

export default useTreeStore;
