import { create } from "zustand";
import { Set } from "@/models/models";
import { mockCardSetsById } from "@/models/mockdata";

interface CardSetState {
  cardSetsById: Record<string, Set>;
  setCardSet: (id: string, updates: Partial<Set>) => void;
}

export const useCardSetStore = create<CardSetState>((set) => ({
  cardSetsById: mockCardSetsById,
  setCardSet: (id, updates) =>
    set((state) => ({
      cardSetsById: {
        ...state.cardSetsById,
        [id]: { ...state.cardSetsById[id], ...updates },
      },
    })),
}));

export default useCardSetStore;
