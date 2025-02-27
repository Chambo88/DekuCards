import { nodePost } from "@/api/nodeApi";
import { setPost } from "@/api/setApi";
import { useToast } from "@/hooks/use-toast";
import {
  createSetModel,
  createNodeModel,
  FlashCard,
  Set,
  Node,
} from "@/models/models";
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
    updates: Partial<Set>,
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

  const createNode = async (x: number, y: number, title: string) => {
    let node: Node = createNodeModel({
      position_x: x,
      position_y: y,
      title: title,
    });
    try {
      await nodePost(node);
    } catch (error) {
      console.error("Error in createNode:", error);
      throw error;
    }
    return node;
  };

  const createSet = async ({
    set,
    node = null,
  }: {
    set: Set;
    node?: Node | null;
  }) => {
    try {
      if (node == null) {
        node = await createNode(position_x, position_y, set.title);
        set.relative_x = 0;
        set.relative_y = 0;
      }

      let newState = useCardSetStore.setState((state) => ({
        cardSetsById: {
          ...state.cardSetsById,
          [set.id]: set,
        },
      }));

      await setPost(set, node.id);

      toast({
        title: "Success",
        description: "New card set created.",
      });

      return getCurrentState();
    } catch (error) {
      console.error("Error in createSetNode service:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          "There was an error creating this set. Set will only exist locally. User the updates tab to try to sync this set with the database again.",
      });
      throw error;
    }
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
