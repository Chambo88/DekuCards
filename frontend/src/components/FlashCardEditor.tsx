// FlashCardEditor.tsx
import React, { useState } from "react";
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

  return (
    <Dialog open={true} onOpenChange={() => console.log("cancel")}>
      {children}
      <DialogContent
        className="h-screen max-w-[800px] overflow-y-auto bg-white p-6"
        style={{ height: "100vh" }}
      >
        <DialogHeader>
          {/* Editable Title */}
          {isTitleEditable ? (
            <Input
              className="mb-2 text-xl font-bold"
              value={editingCardSet.title}
              onChange={handleTitleChange}
              onBlur={() => setIsTitleEditable(false)}
              autoFocus
            />
          ) : (
            <DialogTitle
              onDoubleClick={() => setIsTitleEditable(true)}
              className="mb-2 cursor-pointer text-xl font-bold"
            >
              {editingCardSet.title || "Untitled"}
            </DialogTitle>
          )}
        </DialogHeader>

        {/* Description */}
        <Textarea
          className="mb-4 resize-none"
          value={editingCardSet.desc}
          onChange={handleDescriptionChange}
          rows={3}
          placeholder="No description provided"
        />

        {/* Prerequisites */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Prerequisites</h3>
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
        <DialogFooter className="fixed bottom-0 left-0 w-full bg-white p-4 shadow-lg">
          <Button onClick={() => console.log("saved")}>Save changes</Button>
          <Button
            variant="secondary"
            onClick={() => console.log("cancel")}
            className="ml-2"
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FlashCardEditor;
