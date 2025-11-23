import { create } from "zustand";
import { DekuNode, DekuSet, FlashCard } from "@/models/models";
import { get, set } from "idb-keyval";

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
  loadFromPersistence: () => Promise<void>;
  mergeTreeData: (
    nodes: Record<string, DekuNode>,
    sets: Record<string, DekuSet>,
    cards: Record<string, Record<string, FlashCard>>
  ) => void;
}

const STORE_KEY = "deku-tree-store";

export const useTreeStore = create<TreeState>((setStore, getStore) => ({
  dekuNodes: {},
  dekuSets: {},
  setToCards: {},

  updateNode: (nodeId, updates) => {
    setStore((state) => {
      const newState = {
        dekuNodes: {
          ...state.dekuNodes,
          [nodeId]: { ...state.dekuNodes[nodeId], ...updates },
        },
      };
      saveToPersistence(getStore());
      return newState;
    });
  },

  updateSet: (setId, updates) => {
    setStore((state) => {
      const newState = {
        dekuSets: {
          ...state.dekuSets,
          [setId]: { ...state.dekuSets[setId], ...updates },
        },
      };
      saveToPersistence(getStore());
      return newState;
    });
  },

  addCards: (setId, newCards) => {
    setStore((state) => {
      const newState = {
        setToCards: {
          ...state.setToCards,
          [setId]: {
            ...(state.setToCards[setId] || {}),
            ...newCards,
          },
        },
      };
      saveToPersistence(getStore());
      return newState;
    });
  },

  updateCard: (setId, cardId, updates) => {
    setStore((state) => {
      const newState = {
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
      };
      saveToPersistence(getStore());
      return newState;
    });
  },

  deleteCards: (setId, cardIds) => {
    setStore((state) => {
      const currentCards = state.setToCards[setId] ?? {};
      const updatedCards: Record<string, FlashCard> = {};

      for (const [cardId, card] of Object.entries(currentCards)) {
        if (!cardIds.has(cardId)) {
          updatedCards[cardId] = card;
        }
      }

      const newState = {
        setToCards: {
          ...state.setToCards,
          [setId]: updatedCards,
        },
      };
      saveToPersistence(getStore());
      return newState;
    });
  },

  initSets: (sets) => {
    setStore(() => ({
      dekuSets: sets,
    }));
    saveToPersistence(getStore());
  },

  initNodes: (nodes) => {
    setStore(() => ({
      dekuNodes: nodes,
    }));
    saveToPersistence(getStore());
  },

  initCards: (cards) => {
    setStore(() => ({
      setToCards: cards,
    }));
    saveToPersistence(getStore());
  },

  loadFromPersistence: async () => {
    const storedState = await get<Partial<TreeState>>(STORE_KEY);
    if (storedState) {
      setStore((state) => ({
        ...state,
        dekuNodes: storedState.dekuNodes || {},
        dekuSets: storedState.dekuSets || {},
        setToCards: storedState.setToCards || {},
      }));
    }
  },

  mergeTreeData: (
    nodes: Record<string, DekuNode>,
    sets: Record<string, DekuSet>,
    cards: Record<string, Record<string, FlashCard>>
  ) => {
    setStore((state) => {
      // Merge Nodes
      const newNodes = { ...state.dekuNodes, ...nodes };

      // Merge Sets
      const newSets = { ...state.dekuSets, ...sets };

      // Merge Cards
      // We need to merge card sets carefully. 
      // If a set exists in 'cards' (the delta), we merge its cards into the existing set.
      const newSetToCards = { ...state.setToCards };
      
      for (const [setId, setCards] of Object.entries(cards)) {
          newSetToCards[setId] = {
              ...(newSetToCards[setId] || {}),
              ...setCards
          };
      }

      const newState = {
        dekuNodes: newNodes,
        dekuSets: newSets,
        setToCards: newSetToCards,
      };
      
      saveToPersistence(getStore());
      return newState;
    });
  },
}));

// Debounce save to avoid excessive IDB writes
let saveTimeout: NodeJS.Timeout;
const saveToPersistence = (state: TreeState) => {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    const { dekuNodes, dekuSets, setToCards } = state;
    set(STORE_KEY, { dekuNodes, dekuSets, setToCards });
  }, 1000);
};

export default useTreeStore;
