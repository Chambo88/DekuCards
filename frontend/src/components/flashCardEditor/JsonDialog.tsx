import React, { useState } from "react";
import { z } from "zod";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogHeader,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { FlashCardSet, FlashCard } from "@/models/models";
import { LightBulbIcon } from "@heroicons/react/24/outline";
import { Textarea } from "../ui/textarea";
import { MAX_FLASHCARD_CHAR } from "@/constants";

interface JsonDialogProps {
  children: React.ReactNode;
  setCardSet: React.Dispatch<React.SetStateAction<FlashCardSet>>;
}

const flashCardSchema = z.object({
  front: z.string().min(1).max(255),
  back: z.string().min(1).max(255),
});

const flashCardsSchema = z.array(flashCardSchema).max(20); // Limit to 20 cards

const JsonDialog: React.FC<JsonDialogProps> = ({ children, setCardSet }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [jsonInput, setJsonInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSave = () => {
    try {
      const parsedData = JSON.parse(jsonInput);
      const validatedData = flashCardsSchema.parse(parsedData);

      setCardSet((prevCardSet) => {
        prevCardSet.cards.push(parsedData);
        return prevCardSet;
      });

      setIsOpen(false);
      setJsonInput("");
      setErrorMessage("");
    } catch (error) {
      console.error("Error parsing or validating JSON:", error);
      setErrorMessage("Invalid JSON format or data structure.");
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
    setErrorMessage("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent
        onInteractOutside={(event) => event.preventDefault()}
        className="flex h-screen max-w-[1000px] flex-col bg-background"
      >
        <DialogHeader>
          <DialogTitle>Add Cards via AI/JSON</DialogTitle>
        </DialogHeader>

        <DialogDescription>
          <div className="mb-4 flex items-center">
            <LightBulbIcon className="mr-2 h-6 w-6" />
            <span>
              Hint: Copy the prompt into an AI of choice followed by the content
              you'd like converted into flashcards. Paste the result here to use
              the AI-generated flashcards.
            </span>
          </div>
          <pre className="rounded bg-gray-100 p-2">
            Content should be formatted as follows:
            {`
[
  {
    "front": "Question 1",
    "back": "Answer 1"
  },
  {
    "front": "Question 2",
    "back": "Answer 2"
  },
  ...
]
            `}
          </pre>
        </DialogDescription>

        {errorMessage && (
          <div className="mb-2 text-destructive">{errorMessage}</div>
        )}

        <Textarea
          className="mb-4 resize-none overflow-hidden"
          style={{ overflowWrap: "anywhere" }}
          value={jsonInput}
          onChange={(e) => {
            setJsonInput(e.target.value);
            if (errorMessage) {
              setErrorMessage("");
            }
          }}
          placeholder='[{"front": "Question 1", "back": "Answer 1"}, {"front": "Question 2", "back": "Answer 2"}]'
          autoFocus
          maxLength={MAX_FLASHCARD_CHAR}
        />

        <DialogFooter className="border-t bg-background p-4 shadow-lg">
          <Button onClick={handleSave}>Save Changes</Button>
          <Button variant="secondary" onClick={handleCancel} className="ml-2">
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default JsonDialog;
