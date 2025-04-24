import { useRef, useState } from "react";
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
import { FlashCard, DekuSet } from "@/models/models";
import PrerequisiteEditor from "./PrerequisiteEditor";
import TitleEditor from "./TitleEditor";
import DescriptionEditor from "./DescriptionEditor";
import CardEditor from "./CardEditor";
import { CancelConfirmDialogContent } from "../common/CancelConfirmDialog";
import { TrashIcon } from "@heroicons/react/24/outline";
import { SquareArrowRightIcon } from "lucide-react";
import useCardEditService from "@/services/useSetService";
import { useToast } from "@/hooks/use-toast";
import useTreeStore from "@/stores/useTreeStore";

export const flashCardSchema = z.object({
  front: z.string().trim().min(1, "A card has an empty front."),
  back: z.string().trim().min(1, "A card has an empty back."),
});

export const cardSetSchema = z.object({
  title: z.string().trim().min(1, "Title is empty."),
});

export const cardSetWithCardsSchema = z.object({
  dekuSet: cardSetSchema,
  cards: z.array(flashCardSchema),
});

export interface EditorProps {
  dekuSetId: string;
}

interface FlashCardDialogProps {
  dekuSetId: string;
  close: () => void;
}

const FlashCardDialog: React.FC<FlashCardDialogProps> = ({
  dekuSetId,
  close,
}) => {
  const [selectDeleteOpen, setSelectDeleteOpen] = useState(false);
  const selectedCards = useRef<Set<string>>(new Set());
  const { toast } = useToast();
  const { deleteCards } = useTreeStore()
  // const { moveCards } = useCardEditService();


  const handlClose = () => {
    const dekuSet: DekuSet = useTreeStore.getState().dekuSets[dekuSetId];
    const cards: Record<string, FlashCard> = useTreeStore.getState().setToCards[dekuSetId];

    const parseResult = cardSetWithCardsSchema.safeParse({
      set: dekuSet,
      cards: cards,
    });

    if (!parseResult.success) {
      toast({
        variant: "destructive",
        title: "Card set is missing fields!",
        description: `Reason: ${parseResult.error.errors[0].message}`,
      });
    } else {
      close();
    }
  };

  const handleSelectMove = () => {
    // moveCards()
    handleSelectDelete();
  };

  const handleSelectDelete = () => {
    deleteCards(dekuSetId, selectedCards.current);
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
          <TitleEditor dekuSetId={dekuSetId}/>
        </DialogHeader>
        <DescriptionEditor dekuSetId={dekuSetId}/>
        <PrerequisiteEditor dekuSetId={dekuSetId}/>
        <CardEditor dekuSetId={dekuSetId} selectedCards={selectedCards} />
      </div>

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
            {selectedCards.current.size > 0 && (
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
          onClick={handlClose}
        >
          Close
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default FlashCardDialog;

