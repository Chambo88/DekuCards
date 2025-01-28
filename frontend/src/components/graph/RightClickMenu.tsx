import React, { Dispatch, SetStateAction, useRef, useState } from "react";
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Node, Edge } from "reactflow";
import { createFlashCardSet, FlashCardSet } from "@/models/models";
import { generateElements } from "./graphFunctions";
import CancelConfirmDialog, {
  CancelConfirmDialogContent,
} from "../common/CancelConfirmDialog";
import { Dialog } from "../ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import FlashCardDialog from "../flashCardEditor/FlashCardDialog";

const RightClickMenu: React.FC<{
  children: React.ReactNode;
  menuType: "node" | "pane" | null;
  cardSets: FlashCardSet[];
  setNodes: Dispatch<React.SetStateAction<Node<any, string | undefined>[]>>;
  setEdges: Dispatch<React.SetStateAction<Edge[]>>;
  menuCoords: {
    x: number;
    y: number;
  } | null;
  clickedNode: Node | null;
}> = ({
  children,
  menuType,
  cardSets,
  setNodes,
  setEdges,
  menuCoords,
  clickedNode,
}) => {
  const handleCreateCardSet = () => {
    // TODO properly handle increasing cardSet
    let count = 0;
    let newTitle = "";
    let titleCreated = false;

    while (!titleCreated) {
      let alreadyMade = false;
      let newPotentialTitle = "New Card set " + (count === 0 ? "" : count);

      for (const cardSet of cardSets) {
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
    console.log(JSON.stringify(clickedNode?.data));
    const newCardSet = createFlashCardSet({
      title: newTitle,
      parent_id: clickedNode?.data.cardSet.id ?? null,
      position_x: menuCoords?.x ?? 0,
      position_y: menuCoords?.y ?? 0,
    });
    cardSets.push(newCardSet);

    console.log(JSON.stringify(newCardSet));
    setNodes(generateElements(cardSets).nodes);
    setEdges(generateElements(cardSets).edges);
  };

  const deleteCardSet = () => {
    let newCardSets = cardSets.filter(
      (cardSet) => cardSet.id != clickedNode?.data.cardSet.Id,
    );

    newCardSets.forEach((cardSet) => {
      if ((cardSet.parent_id = clickedNode?.data.Id)) cardSet.parent_id = null;
    });
    setNodes(generateElements(newCardSets).nodes);
    setEdges(generateElements(newCardSets).edges);

    setIsDeleteOpen(false);
  };

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const editorDataRef = useRef<FlashCardSet | null>(null);

  return (
    <>
      <Dialog open={isEditorOpen}>
        <FlashCardDialog
          initialData={
            clickedNode?.data.cardSet ??
            createFlashCardSet({
              title: "Error",
              parent_id: clickedNode?.data.cardSet.id ?? null,
              position_x: menuCoords?.x ?? 0,
              position_y: menuCoords?.y ?? 0,
            })
          }
          setIsOpen={setIsEditorOpen}
        />
      </Dialog>

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <CancelConfirmDialogContent
          title={"Delete"}
          desc={`Are you sure you want to delete the cardset: ${clickedNode?.data.cardSet.title}`}
          primaryText={"Delete"}
          secondaryText={"Cancel"}
          destructive={true}
          confirm={deleteCardSet}
          cancel={() => setIsDeleteOpen(false)}
        />
      </Dialog>

      <ContextMenu>
        <ContextMenuTrigger>{children}</ContextMenuTrigger>
        <ContextMenuContent className="w-64">
          {menuType === "node" && (
            <>
              <ContextMenuItem
                onSelect={() => {
                  editorDataRef.current = clickedNode?.data.cardSet;
                  setIsEditorOpen(true);
                }}
              >
                Edit Set
              </ContextMenuItem>

              <ContextMenuItem onSelect={() => setIsDeleteOpen(true)}>
                Delete Set
              </ContextMenuItem>

              <ContextMenuItem onSelect={handleCreateCardSet}>
                Create child set
              </ContextMenuItem>
            </>
          )}
          <ContextMenuItem onSelect={handleCreateCardSet}>
            Create card set
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </>
  );
};

export default RightClickMenu;
