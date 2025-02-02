import { useState } from "react";
import { z } from "zod";
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
import { useToast } from "@/hooks/use-toast";

const cardSchema = z.object({
  front: z.string().trim().min(1, "A card has an empty front."),
  back: z.string().trim().min(1, "A card has an empty Back."),
});

const cardSetSchema = z.object({
  title: z.string().trim().min(1, "Title is empty."),
  cards: z.array(cardSchema),
});

export interface EditorProps {
  cardSet: FlashCardSet;
  setCardSet: React.Dispatch<React.SetStateAction<FlashCardSet>>;
}

interface FlashCardDialogProps {
  initialData: FlashCardSet;
  close: () => void;
}

const FlashCardDialog: React.FC<FlashCardDialogProps> = ({
  initialData,
  close,
}) => {
  const [cardSet, setCardSet] = useState(initialData);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectDeleteOpen, setSelectDeleteOpen] = useState(false);
  const { toast } = useToast();
  const { moveCards } = useCardEditService();

  const selectedIds = new Set(
    cardSet.cards.filter((card) => card.selected).map((card) => card.id),
  );
  const parseResult = cardSetSchema.safeParse(cardSet);

  const handleSave = () => {
    // TODO Handle save properly
    if (!parseResult.success) {
      toast({
        variant: "destructive",
        title: "Couldn't save! missing fields",
        description: `Reason: ${parseResult.error.errors[0].message}`,
      });
    } else {
      console.log("handle save");
      close();
    }
  };

  const handleCancel = (event: any) => {
    console.log("handle cancel {");
    console.log(event);

    if (
      event.type === "focus" ||
      event.target.closest("[data-dialog-content]")
    ) {
      return;
    }
    event.preventDefault();
    if (isEqual(initialData, cardSet)) {
      console.log("handle cancel");

      close();
    } else {
      setCancelDialogOpen(true);
    }
  };

  const confirmCancel = () => {
    setCancelDialogOpen(false);
    close();
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
    <DialogContent
      tabIndex={-1}
      className="flex h-screen max-w-[1000px] flex-col rounded-none border-none bg-background outline-none"
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
        <Button
          className={parseResult.success ? "" : "opacity-50"}
          onClick={handleSave}
        >
          Save changes
        </Button>
        <Button variant="secondary" onClick={handleCancel} className="ml-2">
          Cancel
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default FlashCardDialog;
