import React, { Dispatch, SetStateAction } from "react";
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
import { Node } from "reactflow";
import { createFlashCardSet, FlashCardSet } from "@/models/models";
import { generateElements } from "./graphFunctions";

const RightClickMenu: React.FC<{
  children: React.ReactNode;
  menuType: "node" | "pane" | null;
  cardSets: FlashCardSet[];
  setNodes: Dispatch<React.SetStateAction<Node<any, string | undefined>[]>>;
  menuCoords: {
    x: number;
    y: number;
  } | null;
  // setEdges: Dispatch<React.SetStateAction<Node<any, string | undefined>[]>>;
}> = ({ children, menuType, cardSets, setNodes, menuCoords }) => {
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
    const newCardSet = createFlashCardSet({
      title: newTitle,
      position_x: menuCoords?.x ?? 0,
      position_y: menuCoords?.y ?? 0,
    });
    cardSets.push(newCardSet);
    console.log(JSON.stringify(cardSets));
    setNodes(generateElements(cardSets).nodes);
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-64">
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
          <ContextMenuRadioItem value="colm">Colm Tuite</ContextMenuRadioItem>
        </ContextMenuRadioGroup>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default RightClickMenu;
