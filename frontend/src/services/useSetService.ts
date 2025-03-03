import { nodePost } from "@/api/nodeApi";
import { setPost } from "@/api/setApi";
import { useToast } from "@/hooks/use-toast";
import {
  createSetModel,
  createNodeModel,
  FlashCard,
  DekuSet,
  DekuNode,
} from "@/models/models";
import useCardSetStore from "@/stores/useTreeStore";

const useCardEditService = () => {
  const { toast } = useToast();
  const updateNodeState = useCardSetStore((state) => state.updateNode);
  const updateSetState = useCardSetStore((state) => state.updateSet);

  const getCurrentState = () => {
    return useCardSetStore.getState().nodes;
  };

  // const moveCards = (
  //   sourceSetId: string,
  //   targetSetId: string,
  //   targetTitle: string,
  //   cardIds: string[],
  // ) => {
  //   const sourceSet = getCurrentState()[sourceSetId];
  //   const targetSet = getCurrentState()[targetSetId];

  //   if (!sourceSet || !targetSet) {
  //     toast({
  //       variant: "destructive",
  //       title: "Error",
  //       description: "Source or target card set not found.",
  //     });
  //     return;
  //   }

  //   const cardsToMove = sourceSet.cards.filter((card) =>
  //     cardIds.includes(card.id),
  //   );
  //   const updatedSourceCards = sourceSet.cards.filter(
  //     (card) => !cardIds.includes(card.id),
  //   );
  //   const updatedTargetCards = [...targetSet.cards, ...cardsToMove];

  //   setCardSet(sourceSetId, { cards: updatedSourceCards });
  //   setCardSet(targetSetId, { cards: updatedTargetCards });

  //   toast({
  //     title: "Success",
  //     description: `Moved ${cardsToMove.length} card(s) to the the flash card set ${targetTitle}.`,
  //   });
  // };

  // const updateSet = (
  //   setId: string,
  //   updates: Partial<DekuSet>,
  //   raiseToast: boolean = true,
  // ) => {
  //   if (!getCurrentState()[setId]) {
  //     toast({
  //       variant: "destructive",
  //       title: "Error",
  //       description: "Card set not found. Cannot modify set.",
  //     });
  //     return;
  //   }

  //   const updatedSet = { ...getCurrentState()[setId], ...updates };
  //   setCardSet(setId, updatedSet);

  //   if (raiseToast) {
  //     toast({
  //       title: "Success",
  //       description: "Card set updated successfully.",
  //     });
  //   }
  // };

  const getTree = () => {
    
  }

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

  // const createNode = async (x: number, y: number, title: string) => {
  //   let node: DekuNode = createNodeModel({
  //     position_x: x,
  //     position_y: y,
  //     title: title,
  //   });
  //   try {
  //     await nodePost(node);
  //   } catch (error) {
  //     console.error("Error in createNode:", error);
  //     throw error;
  //   }
  //   return node;
  // };

  const createSet = async ({
    set,
    node = null,
    position_x,
    position_y
  }: {
    set: DekuSet;
    node?: DekuNode | null;
    position_x: number;
    position_y: number;
  }) => {
    // Local state
    if (node == null) {
      node = createNodeModel({
        position_x: position_x,
        position_y: position_y,
        title: set.title,
      });
      set.relative_x = 0;
      set.relative_y = 0;
    }

    node.sets[set.id] = set; 

    updateNodeState(node.id, node);

    try {
      if (node == null) {
        await nodePost(node);
      }
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
          "There was an error creating this set. Set will only exist locally. Use the updates tab to try to sync this set with the database again.",
      });
      throw error;
    }
  };

  // const deleteSet = (setId: string) => {
  //   console.log(setId);
  //   if (!getCurrentState()[setId]) {
  //     toast({
  //       variant: "destructive",
  //       title: "Error",
  //       description: "Card set not found.",
  //     });
  //     return;
  //   }

  //   useCardSetStore.setState((state) => {
  //     const { [setId]: _, ...remainingSets } = state.cardSetsById;
  //     return { cardSetsById: remainingSets };
  //   });

  //   toast({
  //     title: "Success",
  //     description: "Card set deleted successfully.",
  //   });

  //   return getCurrentState();
  // };

  return { 
    // moveCards, 
    // updateSet, 
    createSet, 
    // deleteSet 
  };
};

export default useCardEditService;
