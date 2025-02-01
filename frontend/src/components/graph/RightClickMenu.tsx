import React, { Dispatch, useState } from "react";
import { Node, Edge } from "reactflow";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useCardEditService from "@/services/useCardEditService";
import { generateElements } from "./graphFunctions";
import { Dialog } from "@radix-ui/react-dialog";
import FlashCardDialog from "../flashCardEditor/FlashCardDialog";
import { createFlashCardSet } from "@/models/models";
import { CancelConfirmDialogContent } from "../common/CancelConfirmDialog";

interface RightClickMenuProps {
  x: number;
  y: number;
  menuType: "node" | "pane";
  clickedNode?: any;
  setNodes: Dispatch<React.SetStateAction<Node<any, string | undefined>[]>>;
  setEdges: Dispatch<React.SetStateAction<Edge[]>>;
  onClose: () => void;
}

const RightClickMenu: React.FC<RightClickMenuProps> = ({
  x,
  y,
  menuType,
  clickedNode,
  setNodes,
  setEdges,
  onClose,
}) => {
  const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();
  const { deleteSet, createSet } = useCardEditService();

  const handleCreateCardSet = () => {
    let newState = createSet({
      title: null,
      parent_id: clickedNode?.data.cardSet.id ?? null,
      position_x: x ?? 0,
      position_y: y ?? 0,
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

  console.log("menu");

  return (
    <>
      <Dialog open={isEditorOpen}>
        <FlashCardDialog
          initialData={
            clickedNode?.data.cardSet ??
            createFlashCardSet({
              title: "Error",
              parent_id: clickedNode?.data.cardSet.id ?? null,
              position_x: x ?? 0,
              position_y: y ?? 0,
            })
          }
          close={() => {
            setIsEditorOpen(false);
            onClose();
          }}
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
          cancel={() => {
            setIsDeleteOpen(false);
            onClose();
          }}
        />
      </Dialog>

      <DropdownMenu open>
        <DropdownMenuContent
          sideOffset={0}
          align="start"
          onPointerDownOutside={onClose}
          style={{ position: "absolute", left: x, top: y }}
          onClick={stopPropagation}
          onContextMenu={(e) => e.preventDefault()}
        >
          {menuType === "pane" ? (
            <>
              <DropdownMenuItem
                onSelect={() => {
                  console.log("Add Node");
                  onClose();
                }}
              >
                Add Node
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={handleCreateCardSet}>
                Pane Action
              </DropdownMenuItem>
            </>
          ) : (
            <>
              <DropdownMenuItem
                onSelect={() => {
                  setIsEditorOpen(true);
                }}
              >
                Edit Node
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => {
                  setIsDeleteOpen(true);
                  console.log("tests");
                }}
              >
                Delete Node
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default RightClickMenu;
