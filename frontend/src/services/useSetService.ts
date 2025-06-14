import { cardPost, cardPut } from "@/api/cardApi";
import { nodeAndSetPost } from "@/api/nodeApi";
import { setInfoPut, setPost } from "@/api/setApi";
import { getTree } from "@/api/treeApi";
import { useToast } from "@/hooks/use-toast";
import {
  createSetModel,
  createNodeModel,
  FlashCard,
  DekuSet,
  DekuNode,
  createFlashCard,
} from "@/models/models";
import useTreeStore from "@/stores/useTreeStore";
import {
  updateFlashCardOnCorrect,
  updateFlashCardOnIncorrect,
} from "./cardResultHandling";
import { P } from "pino";
import { postUserSessions, getSessionData } from "@/api/userSessionApi";

const useCardEditService = () => {
  const { toast } = useToast();
  const updateCardState = useTreeStore((state) => state.updateCard);
  const updateNodeState = useTreeStore((state) => state.updateNode);
  const updateSetState = useTreeStore((state) => state.updateSet);
  const initNodeState = useTreeStore((state) => state.initNodes);
  const initSetState = useTreeStore((state) => state.initSets);
  const initCardState = useTreeStore((state) => state.initCards);

  const getCurrentState = () => {
    return useTreeStore.getState().dekuNodes;
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

  const initTree = async () => {
    try {
      let tree = await getTree();

      initNodeState(tree.nodes);
      initSetState(tree.sets);
      initCardState(tree.cards);
    } catch (e) {
      console.error("Error in getTree:", e);
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was an error fetching tree data.",
      });
    }
  };

  const getUserSessionsData = async () => {
    try {
      let data = await getSessionData();
    } catch (e) {
      console.error("Error in getTree:", e);
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was an error fetching tree data.",
      });
    }
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

  const createCardLocal = (setId: string) => {
    let newCard: FlashCard = createFlashCard({
      set_id: setId,
    });

    updateCardState(setId, newCard.id, newCard);

    return newCard;
  };

  const handleCardCorrect = async (setId: string, card: FlashCard) => {
    let updatedCard = updateFlashCardOnCorrect(card);
    updateCardState(setId, updatedCard.id, updatedCard);
    await updateCardDB(updatedCard.id, setId);
    await postUserSessions(true);
  };

  const handleCardWrong = async (setId: string, card: FlashCard) => {
    let updatedCard = updateFlashCardOnIncorrect(card);
    updateCardState(setId, updatedCard.id, updatedCard);
    await updateCardDB(updatedCard.id, setId);
    await postUserSessions(false);
  };

  const createCardDB = async (
    card: FlashCard,
    setId: string,
    nodeId: string,
  ) => {
    try {
      await cardPost(card, nodeId, setId);
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          "There was an error creating the card. Changes will remain on this device until internet is restored.",
      });
    }
  };

  const updateCardDB = async (cardId: string, setId: string) => {
    try {
      let card = useTreeStore.getState().setToCards[setId][cardId];
      await cardPut(card);
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          "There was an error updating the card. Changes will remain on this device until internet is restored.",
      });
    }
  };

  const updateDekuSetDB = async (dekuSetId: string) => {
    try {
      let dekuSet = useTreeStore.getState().dekuSets[dekuSetId];
      await setInfoPut(dekuSet);
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          "There was an error updating the set. Changes will remain on this device until internet is restored.",
      });
      throw e;
    }
  };

  const createSetAndNodeLocal = (nodeX: number, nodeY: number) => {
    let newNode = createNodeModel({
      position_x: nodeX,
      position_y: nodeY,
    });

    let newSet: DekuSet = createSetModel({
      parent_set_id: null,
      parent_node_id: newNode.id,
      relative_x: 0,
      relative_y: 0,
    });

    updateNodeState(newNode.id, newNode);
    updateSetState(newSet.id, newSet);

    return { newNode, newSet };
  };

  const createSetAndNodeDB = async (newSet: DekuSet, newNode: DekuNode) => {
    try {
      await nodeAndSetPost(newNode, newSet);
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          "There was an error creating this set. Set will only exist locally. Use the updates tab to try to sync this set with the database again.",
      });
      throw e;
    }
  };

  // Function called when creating a new set with no parent
  // const createSet = async (
  //   set : DekuSet,
  //   node : DekuNode
  // ) => {

  //   //TODO dynamically set the relatives of new set if others exist
  //   set.relative_x = 0;
  //   set.relative_y = 0;

  //   node.sets[set.id] = set;
  //   updateNodeState(node.id, node);

  //   try {
  //     await nodeAndSetPost(node, set);

  //     toast({
  //       title: "Success",
  //       description: "New card set created.",
  //     });

  //     return getCurrentState();
  //   } catch (e) {
  //     console.error("Error in createSetNode service:", e);
  //     toast({
  //       variant: "destructive",
  //       title: "Error",
  //       description:
  //         "There was an error creating this set. Set will only exist locally. Use the updates tab to try to sync this set with the database again.",
  //     });
  //     throw e;
  //   }
  // };

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
    // createSet,
    handleCardCorrect,
    handleCardWrong,
    updateCardDB,
    createCardDB,
    createCardLocal,
    updateDekuSetDB,
    createSetAndNodeDB,
    createSetAndNodeLocal,
    initTree,
    // deleteSet
  };
};

export default useCardEditService;
