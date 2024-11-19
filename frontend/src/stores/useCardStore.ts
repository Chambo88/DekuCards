import { create } from "zustand";
import { FlashCardSet } from "@/models/models";

interface CardSetState {
  cardSetsById: Record<string, FlashCardSet>;
  setCardSet: (id: string, updates: Partial<FlashCardSet>) => void;
}

export const useCardSetStore = create<CardSetState>((set) => ({
  cardSetsById: {},
  setCardSet: (id, updates) =>
    set((state) => ({
      cardSetsById: {
        ...state.cardSetsById,
        [id]: { ...state.cardSetsById[id], ...updates },
      },
    })),
}));

export default useCardSetStore;
