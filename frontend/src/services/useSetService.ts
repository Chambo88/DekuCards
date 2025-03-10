import { nodePost } from "@/api/nodeApi";
import { setPost } from "@/api/setApi";
import { getTree } from "@/api/treeApi"
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

  const initTree = async (userId : string) => {
    try {
      // await getTree()

    } catch (e) {
      console.error("Error in getTree:", e);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          "There was an error fetching tree data.",
      });
      throw e;
    }
  }



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

  const createSetAndNode = async (
    set: DekuSet,
    nodeX: number,
    nodeY: number
  ) => {
    // Local state
    let node = createNodeModel({
        position_x: nodeX,
        position_y: nodeY,
        title: set.title,
      });
      set.relative_x = 0;
      set.relative_y = 0;

    let result = await createSet(set, node);

    return result;
  };

  // Function called when creating a new set with no parent
  const createSet = async (
    set : DekuSet,
    node : DekuNode
  ) => {

    // TODO dynamically set the relatives of new set if others exist
    set.relative_x = 0;
    set.relative_y = 0;

    node.sets[set.id] = set; 
    updateNodeState(node.id, node);

    try {
      await nodePost(node);
      await setPost(set, node.id);

      toast({
        title: "Success",
        description: "New card set created.",
      });

      return getCurrentState();
    } catch (e) {
      console.error("Error in createSetNode service:", e);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          "There was an error creating this set. Set will only exist locally. Use the updates tab to try to sync this set with the database again.",
      });
      throw e;
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
    createSetAndNode,
    initTree,
    // deleteSet 
  };
};

export default useCardEditService;
