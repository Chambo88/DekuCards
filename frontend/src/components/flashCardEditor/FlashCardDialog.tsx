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
import { FlashCardSet } from "@/models/models";
import PrerequisiteEditor from "./PrerequisiteEditor";
import TitleEditor from "./TitleEditor";
import DescriptionEditor from "./DescriptionEditor";
import CardEditor from "./CardEditor";
import CancelConfirmDialog, {
  CancelConfirmDialogContent,
} from "../common/CancelConfirmDialog";

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

  const cancelCancelling = () => {
    setCancelDialogOpen(false);
  };

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

          {/* Cancel Dialog */}
          <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
            <CancelConfirmDialogContent
              title="Discard Changes"
              desc="Are you sure you want to discard all changes you've made?"
              confirm={confirmCancel}
              cancel={cancelCancelling}
            />
          </Dialog>

          <DialogFooter className="border-t bg-background p-4 shadow-lg">
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
