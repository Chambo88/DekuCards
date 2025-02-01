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
import useCardSetStore from "@/stores/useCardStore";
import useCardEditService from "@/services/useCardEditService";

const RightClickMenu2: React.FC<{
  children: React.ReactNode;
  menuType: "node" | "pane" | null;
  setNodes: Dispatch<React.SetStateAction<Node<any, string | undefined>[]>>;
  setEdges: Dispatch<React.SetStateAction<Edge[]>>;
  menuCoords: {
    x: number;
    y: number;
  } | null;
  clickedNode: Node | null;
}> = ({ children, menuType, setNodes, setEdges, menuCoords, clickedNode }) => {
  const { deleteSet, createSet } = useCardEditService();

  const handleCreateCardSet = () => {
    let newState = createSet({
      title: null,
      parent_id: clickedNode?.data.cardSet.id ?? null,
      position_x: menuCoords?.x ?? 0,
      position_y: menuCoords?.y ?? 0,
    });

    setNodes(generateElements(newState).nodes);
    setEdges(generateElements(newState).edges);
  };

  const deleteCardSet = () => {
    let newState = deleteSet(clickedNode?.data.cardSet.id);

    if (newState) {
      setNodes(generateElements(newState).nodes);
      setEdges(generateElements(newState).edges);
    }

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

export default RightClickMenu2;
