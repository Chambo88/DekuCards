import React, { Dispatch, SetStateAction, useState } from "react";
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
      (cardSet) => cardSet.id != clickedNode?.data.Id,
    );

    newCardSets.forEach((cardSet) => {
      if ((cardSet.parent_id = clickedNode?.data.Id)) cardSet.parent_id = null;
    });
    setNodes(generateElements(newCardSets).nodes);
    setEdges(generateElements(newCardSets).edges);
  };

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <CancelConfirmDialogContent
          title={""}
          desc={"desc"}
          primaryText={"primaryText"}
          secondaryText={"secondaryText"}
          destructive={true}
          confirm={deleteCardSet}
          cancel={() => setIsOpen(false)}
        />

        <ContextMenu>
          <ContextMenuTrigger>{children}</ContextMenuTrigger>
          <ContextMenuContent className="w-64">
            {menuType === "node" && (
              <>
                <DialogTrigger asChild>
                  <ContextMenuItem>Delete set</ContextMenuItem>
                </DialogTrigger>

                <ContextMenuItem onSelect={handleCreateCardSet}>
                  Create child set
                </ContextMenuItem>
              </>
            )}
            <ContextMenuItem onSelect={handleCreateCardSet}>
              Create card set
            </ContextMenuItem>
            <ContextMenuItem inset disabled>
              NOOOOODE
              <ContextMenuShortcut>⌘]</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem inset>
              Reload
              <ContextMenuShortcut>⌘R</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuSub>
              <ContextMenuSubTrigger inset>More Tools</ContextMenuSubTrigger>
              <ContextMenuSubContent className="w-48">
                <ContextMenuItem>
                  Save Page As...
                  <ContextMenuShortcut>⇧⌘S</ContextMenuShortcut>
                </ContextMenuItem>
                <ContextMenuItem>Create Shortcut...</ContextMenuItem>
                <ContextMenuItem>Name Window...</ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem>Developer Tools</ContextMenuItem>
              </ContextMenuSubContent>
            </ContextMenuSub>
            <ContextMenuSeparator />
            <ContextMenuCheckboxItem checked>
              Show Bookmarks Bar
              <ContextMenuShortcut>⌘⇧B</ContextMenuShortcut>
            </ContextMenuCheckboxItem>
            <ContextMenuCheckboxItem>Show Full URLs</ContextMenuCheckboxItem>
            <ContextMenuSeparator />
            <ContextMenuRadioGroup value="pedro">
              <ContextMenuLabel inset>People</ContextMenuLabel>
              <ContextMenuSeparator />
              <ContextMenuRadioItem value="pedro">
                Pedro Duarte
              </ContextMenuRadioItem>
              <ContextMenuRadioItem value="colm">
                Colm Tuite
              </ContextMenuRadioItem>
            </ContextMenuRadioGroup>
          </ContextMenuContent>
        </ContextMenu>
      </Dialog>
    </>
  );
};

export default RightClickMenu;
