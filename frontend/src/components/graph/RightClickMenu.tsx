import React, { Dispatch, useState } from "react";
import { Node, Edge } from "reactflow";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useCardEditService from "@/services/useSetService";
import { generateElements } from "./graphFunctions";
import { Dialog } from "@radix-ui/react-dialog";
import FlashCardDialog from "../flashCardEditor/FlashCardDialog";
import { createSetModel, DekuSet } from "@/models/models";
import { CancelConfirmDialogContent } from "../common/CancelConfirmDialog";

interface RightClickMenuProps {
  menuCoords: { x: number; y: number } | null;
  menuType: "node" | "pane" | null;
  clickedNode?: any;
  refreshNodes: () => void;
  refreshEdges: () => void;
  onClose: () => void;
}

const RightClickMenu: React.FC<RightClickMenuProps> = ({
  menuCoords,
  menuType,
  clickedNode,
  refreshNodes,
  refreshEdges,
  onClose,
}) => {
  // const { deleteSet, createSet } = useCardEditService();
    const { createSetAndNode } = useCardEditService();

  const handleCreateSetAndNode = async () => {
    try{
      console.log("handling create card set")
      await createSetAndNode(menuCoords?.x ?? 0, menuCoords?.y ?? 0);
  
      refreshNodes();
      refreshEdges();

    } catch (e) {
      // TODO proper error handling
      console.log(e)
    }

    //TODO Open dialog first before creating data/calling api
  };

  const deleteCardSet = () => {
    // let newState = deleteSet(clickedNode?.data.cardSet.id);

    // if (newState) {
    //   setNodes(generateElements(newState).nodes);
    //   setEdges(generateElements(newState).edges);
    // }

    setIsDeleteOpen(false);
  };

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  return (
    <>
      {clickedNode && (
        <Dialog open={isEditorOpen}>
          <FlashCardDialog
            key={clickedNode.data.cardSet.id}
            initialData={clickedNode.data.cardSet}
            close={() => {
              setIsEditorOpen(false);
            }}
          />
        </Dialog>
      )}

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
          }}
        />
      </Dialog>
      {menuCoords && menuType && (
        <DropdownMenu open>
          <DropdownMenuContent
            sideOffset={0}
            align="start"
            onPointerDownOutside={() => {
              onClose();
            }}
            style={{
              position: "absolute",
              left: menuCoords.x,
              top: menuCoords.y,
            }}
            onContextMenu={(e) => e.preventDefault()}
          >
            {menuType === "pane" ? (
              <>
                <DropdownMenuItem
                  onSelect={() => {
                    handleCreateSetAndNode();
                    onClose();
                  }}
                >
                  Add Node
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={handleCreateSetAndNode}>
                  TEMPTest
                </DropdownMenuItem>
              </>
            ) : (
              <>
                <DropdownMenuItem
                  onSelect={() => {
                    setIsEditorOpen(true);
                    onClose();
                  }}
                >
                  Edit Node
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => {
                    setIsDeleteOpen(true);
                    onClose();
                  }}
                >
                  Delete Node
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
};

export default React.memo(RightClickMenu);
