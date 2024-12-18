import { useState } from "react";
import isEqual from "lodash/isEqual";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { FlashCard, FlashCardSet } from "@/models/models";
import PrerequisiteEditor from "./PrerequisiteEditor";
import TitleEditor from "./TitleEditor";
import DescriptionEditor from "./DescriptionEditor";
import CardEditor from "./CardEditor";
import { CancelConfirmDialogContent } from "../common/CancelConfirmDialog";
import { TrashIcon } from "@heroicons/react/24/outline";
import { SquareArrowRightIcon } from "lucide-react";
import useCardEditService from "@/services/useCardEditService";

export interface EditorProps {
  cardSet: FlashCardSet;
  setCardSet: React.Dispatch<React.SetStateAction<FlashCardSet>>;
}

interface FlashCardDialogProps {
  initialData: FlashCardSet;
  children: React.ReactNode;
}

const FlashCardDialog: React.FC<FlashCardDialogProps> = ({
  initialData,
  children,
}) => {
  const [cardSet, setCardSet] = useState(initialData);
  const [isOpen, setIsOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectDeleteOpen, setSelectDeleteOpen] = useState(false);
  const { moveCards } = useCardEditService();
  const selectedIds = new Set(
    cardSet.cards.filter((card) => card.selected).map((card) => card.id),
  );

  const handleSave = () => {
    console.log("saved");
    setIsOpen(false);
  };

  const handleCancel = (event: any) => {
    event.preventDefault();
    if (isEqual(initialData, cardSet)) {
      setIsOpen(true);
    } else {
      setCancelDialogOpen(true);
    }
  };

  const confirmCancel = () => {
    setCancelDialogOpen(false);
    setIsOpen(false);
  };

  const handleSelectMove = () => {
    // moveCards()
    handleSelectDelete();
  };

  const handleSelectDelete = () => {
    setCardSet((prev) => {
      return {
        ...prev,
        cards: prev.cards.filter((card) => !selectedIds.has(card.id)),
      };
    });
    setSelectDeleteOpen(false);
  };

  //TODO Add validation (Ensure title exists)
  //TODO Handle empty description and prerequisites

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>

        <DialogContent
          onInteractOutside={handleCancel}
          className="flex h-screen max-w-[1000px] flex-col bg-background"
        >
          <div className="flex-grow overflow-y-auto scrollbar-thin scrollbar-track-background scrollbar-thumb-secondary">
            <DialogHeader>
              <TitleEditor cardSet={cardSet} setCardSet={setCardSet} />
            </DialogHeader>
            <DescriptionEditor cardSet={cardSet} setCardSet={setCardSet} />
            <PrerequisiteEditor cardSet={cardSet} setCardSet={setCardSet} />
            <CardEditor cardSet={cardSet} setCardSet={setCardSet} />
          </div>

          <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
            <CancelConfirmDialogContent
              title="Discard Changes"
              desc="Are you sure you want to discard all changes you've made?"
              confirm={confirmCancel}
              cancel={() => setCancelDialogOpen(false)}
            />
          </Dialog>

          <Dialog open={selectDeleteOpen} onOpenChange={setSelectDeleteOpen}>
            <CancelConfirmDialogContent
              title="Delete selected"
              desc="Are you sure you want to delete all selected flash cards?"
              confirm={handleSelectDelete}
              cancel={() => setSelectDeleteOpen(false)}
            />
          </Dialog>

          <DialogFooter className="border-t bg-background p-4 shadow-lg">
            <div className="flex w-full justify-between">
              <div>
                {selectedIds.size > 0 && (
                  <>
                    <Button
                      onClick={handleSelectMove}
                      variant="secondary"
                      className="mr-2"
                    >
                      <SquareArrowRightIcon className="mr-2 h-4 w-4" />
                      Move
                    </Button>

                    <Button
                      onClick={() => setSelectDeleteOpen(true)}
                      variant="destructive"
                    >
                      <TrashIcon className="mr-2 h-4 w-4" /> Delete
                    </Button>
                  </>
                )}
              </div>
            </div>
            <Button onClick={handleSave}>Save changes</Button>
            <Button variant="secondary" onClick={handleCancel} className="ml-2">
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FlashCardDialog;
