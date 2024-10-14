// FlashCardEditor.tsx
import { useState, useRef, useEffect, MutableRefObject } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { CardSet, Card } from "@/models/cardSet";

interface FlashCardEditorProps {
  cardSet: CardSet;
  children: React.ReactNode;
}

const FlashCardEditor: React.FC<FlashCardEditorProps> = ({
  cardSet,
  children,
}) => {
  const [editingCardSet, setEditingCardSet] = useState(cardSet);
  const [isTitleEditable, setIsTitleEditable] = useState(false);
  const [isDescEditable, setIsDescEditable] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // State to control dialog open state

  // Handlers for changing title, description, and cards
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingCardSet({ ...editingCardSet, title: e.target.value });
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setEditingCardSet({ ...editingCardSet, desc: e.target.value });
  };

  const handleCardChange = (
    index: number,
    field: keyof Card,
    value: string,
  ) => {
    const updatedCards = [...editingCardSet.cards];
    updatedCards[index] = { ...updatedCards[index], [field]: value };
    setEditingCardSet({ ...editingCardSet, cards: updatedCards });
  };

  const handleSave = () => {
    // Handle saving changes here
    console.log("saved");
    setIsOpen(false); // Close the dialog after saving
  };

  const handleCancel = () => {
    // Handle cancel action here
    console.log("cancel");
    setIsOpen(false); // Close the dialog when canceled
  };

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isDescEditable && textareaRef.current) {
      const textarea = textareaRef.current;
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
      textarea.setSelectionRange(textarea.value.length, textarea.value.length);
    }
  }, [isDescEditable]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent
        className="h-screen max-w-[1000px] overflow-y-auto bg-background p-6"
        style={{ height: "100vh" }}
      >
        <DialogHeader>
          {/* Editable Title */}
          {isTitleEditable ? (
            <Input
              className="mb-1 text-xl font-bold"
              value={editingCardSet.title}
              onChange={handleTitleChange}
              onBlur={() => setIsTitleEditable(false)}
              onFocus={(e) => e.target.select()}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setIsTitleEditable(false);
                }
              }}
              autoFocus
            />
          ) : (
            <DialogTitle
              onClick={() => setIsTitleEditable(true)}
              className="cursor-text p-3 text-xl font-bold hover:bg-muted"
            >
              {editingCardSet.title || "Untitled"}
            </DialogTitle>
          )}
        </DialogHeader>

        {isDescEditable ? (
          <Textarea
            ref={textareaRef}
            className="mb-4 resize-none overflow-hidden"
            style={{ overflowWrap: "anywhere" }}
            value={editingCardSet.desc}
            onChange={(e) => {
              handleDescriptionChange(e);
              const textarea = e.target;
              textarea.style.height = "auto";
              textarea.style.height = `${textarea.scrollHeight}px`;
            }}
            onBlur={() => setIsDescEditable(false)}
            placeholder="Description (optional)"
            autoFocus
            maxLength={1000}
          />
        ) : (
          <p
            className="cursor-text text-wrap p-3 text-sm hover:bg-muted"
            style={{ overflowWrap: "anywhere" }}
            onClick={() => setIsDescEditable(true)}
          >
            {editingCardSet.desc}
          </p>
        )}

        {/* Description */}

        {/* Prerequisites */}
        <div className="mb-4">
          <h3 className="font-semibold">Prerequisites</h3>
          <ul className="list-disc pl-5">
            {editingCardSet.prerequisites.map((prereq, index) => (
              <li key={index}>{prereq}</li>
            ))}
          </ul>
        </div>

        {/* Cards */}
        <div>
          <h3 className="text-lg font-semibold">Cards</h3>
          {editingCardSet.cards.map((card, index) => (
            <div key={index} className="mb-6">
              <div className="mb-2 flex items-center">
                {/* Editable Title */}
                <Input
                  className="text-md font-semibold"
                  value={card.title}
                  onChange={(e) =>
                    handleCardChange(index, "title", e.target.value)
                  }
                  placeholder="Card title (optional)"
                />
              </div>

              <div className="flex space-x-4">
                {/* Editable Front */}
                <Textarea
                  className="w-1/2 resize-none border p-2"
                  value={card.front}
                  onChange={(e) =>
                    handleCardChange(index, "front", e.target.value)
                  }
                  placeholder="Front of the card"
                />
                {/* Editable Back */}
                <Textarea
                  className="w-1/2 resize-none border p-2"
                  value={card.back}
                  onChange={(e) =>
                    handleCardChange(index, "back", e.target.value)
                  }
                  placeholder="Back of the card"
                />
              </div>
              <hr className="mt-4" />
            </div>
          ))}
        </div>

        {/* Fixed Footer for Save/Cancel */}
        <DialogFooter className="fixed bottom-0 left-0 w-full bg-background p-4 shadow-lg">
          <Button onClick={handleSave}>Save changes</Button>
          <Button variant="secondary" onClick={handleCancel} className="ml-2">
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FlashCardEditor;
