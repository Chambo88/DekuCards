import { useToast } from "@/hooks/use-toast";
import { createFlashCardSet, FlashCard, FlashCardSet } from "@/models/models";
import useCardSetStore from "@/stores/useCardStore";

const useCardEditService = () => {
  const { toast } = useToast();
  const setCardSet = useCardSetStore((state) => state.setCardSet);

  const getCurrentState = () => {
    return useCardSetStore.getState().cardSetsById;
  };

  const moveCards = (
    sourceSetId: string,
    targetSetId: string,
    targetTitle: string,
    cardIds: string[],
  ) => {
    const sourceSet = getCurrentState()[sourceSetId];
    const targetSet = getCurrentState()[targetSetId];

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

  const updateSet = (
    setId: string,
    updates: Partial<FlashCardSet>,
    raiseToast: boolean = true,
  ) => {
    if (!getCurrentState()[setId]) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Card set not found. Cannot modify set.",
      });
      return;
    }

    const updatedSet = { ...getCurrentState()[setId], ...updates };
    setCardSet(setId, updatedSet);

    if (raiseToast) {
      toast({
        title: "Success",
        description: "Card set updated successfully.",
      });
    }
  };

  const getNewTitle = () => {
    let count = 0;
    let newTitle = "";
    let titleCreated = false;

    while (!titleCreated) {
      let alreadyMade = false;
      let newPotentialTitle = "New Card set " + (count === 0 ? "" : count);

      for (const cardSet of Object.values(getCurrentState())) {
        if (cardSet.title === newPotentialTitle) {
          count += 1;
          alreadyMade = true;
          break;
        }
      }

      if (!alreadyMade) {
        newTitle = newPotentialTitle;
        titleCreated = true;
      }
    }

    return newTitle;
  };

  const createSet = ({
    title = null,
    parent_id = null,
    position_x = null,
    position_y = null,
  }: {
    title?: string | null;
    parent_id?: string | null;
    position_x?: number | null;
    position_y?: number | null;
  } = {}) => {
    let cardSet: FlashCardSet = createFlashCardSet({
      title: title ?? getNewTitle(),
      parent_id: parent_id,
      position_x: position_x ?? 0,
      position_y: position_y ?? 0,
    });

    let newState = useCardSetStore.setState((state) => ({
      cardSetsById: {
        ...state.cardSetsById,
        [cardSet.id]: cardSet,
      },
    }));

    toast({
      title: "Success",
      description: "New card set created.",
    });

    return getCurrentState();
  };

  const deleteSet = (setId: string) => {
    console.log(setId);
    if (!getCurrentState()[setId]) {
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

    return getCurrentState();
  };

  return { moveCards, updateSet, createSet, deleteSet };
};

export default useCardEditService;
