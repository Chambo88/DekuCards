import { useState } from "react";
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

  const handleSave = () => {
    console.log("saved");
    setIsOpen(false);
  };

  const handleCancel = () => {
    console.log("cancel");
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="flex h-screen max-w-[1000px] flex-col bg-background">
        <div className="flex-grow overflow-y-auto scrollbar-thin scrollbar-track-background scrollbar-thumb-secondary">
          <DialogHeader>
            <TitleEditor cardSet={cardSet} setCardSet={setCardSet} />
          </DialogHeader>
          <DescriptionEditor cardSet={cardSet} setCardSet={setCardSet} />
          <PrerequisiteEditor cardSet={cardSet} setCardSet={setCardSet} />
          <CardEditor cardSet={cardSet} setCardSet={setCardSet} />
        </div>

        <DialogFooter className="border-t bg-background p-4 shadow-lg">
          <Button onClick={handleSave}>Save changes</Button>
          <Button variant="secondary" onClick={handleCancel} className="ml-2">
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FlashCardDialog;
