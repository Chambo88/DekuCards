import { useToast } from "@/hooks/use-toast";
import { FlashCard, FlashCardSet } from "@/models/models";
import useCardSetStore from "@/stores/useCardStore";

const useCardEditService = () => {
  const { toast } = useToast();
  const setCardSet = useCardSetStore((state) => state.setCardSet);
  const cardSetsById = useCardSetStore((state) => state.cardSetsById);

  const moveCards = (
    sourceSetId: string,
    targetSetId: string,
    targetTitle: string,
    cardIds: string[],
  ) => {
    const sourceSet = cardSetsById[sourceSetId];
    const targetSet = cardSetsById[targetSetId];

    if (!sourceSet || !targetSet) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Source or target card set not found.",
      });
      return;
    }

    const cardsToMove = sourceSet.cards.filter((card) =>
      cardIds.includes(card.id),
    );
    const updatedSourceCards = sourceSet.cards.filter(
      (card) => !cardIds.includes(card.id),
    );
    const updatedTargetCards = [...targetSet.cards, ...cardsToMove];

    setCardSet(sourceSetId, { cards: updatedSourceCards });
    setCardSet(targetSetId, { cards: updatedTargetCards });

    toast({
      title: "Success",
      description: `Moved ${cardsToMove.length} card(s) to the the flash card set ${targetTitle}.`,
    });
  };

  const updateSet = (setId: string, updates: Partial<FlashCardSet>) => {
    if (!cardSetsById[setId]) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Card set not found.",
      });
      return;
    }

    setCardSet(setId, updates);

    toast({
      title: "Success",
      description: "Card set updated successfully.",
    });
  };

  const deleteSet = (setId: string) => {
    if (!cardSetsById[setId]) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Card set not found.",
      });
      return;
    }

    useCardSetStore.setState((state) => {
      const { [setId]: _, ...remainingSets } = state.cardSetsById;
      return { cardSetsById: remainingSets };
    });

    toast({
      title: "Success",
      description: "Card set deleted successfully.",
    });
  };

  return { moveCards, updateSet, deleteSet };
};

export default useCardEditService;
