import React, { useState, useMemo } from "react";
import { Input } from "../ui/input";
import { EditorProps } from "./FlashCardDialog";
import { Textarea } from "../ui/textarea";
import { Card } from "@/models/cardSet";
import { Button } from "../ui/button";
import { PlusCircleIcon } from "lucide-react";

const CardEditor: React.FC<EditorProps> = ({ cardSet, setCardSet }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCards = useMemo(() => {
    if (!searchTerm.trim()) {
      return cardSet.cards;
    }
    const search = searchTerm.toLowerCase();
    return cardSet.cards.filter((card) => {
      return (
        card.front.toLowerCase().includes(search) ||
        card.back.toLowerCase().includes(search)
      );
    });
  }, [searchTerm, cardSet.cards]);

  const handleCardChange = (
    index: number,
    field: keyof Card,
    value: string,
  ) => {
    const updatedCards = [...cardSet.cards];
    updatedCards[index] = { ...updatedCards[index], [field]: value };
    setCardSet({ ...cardSet, cards: updatedCards });
  };

  return (
    <div>
      <h3 className="mb-3 pl-10 font-semibold">Cards</h3>
      <div className="mx-6 flex flex-row justify-between">
        <Input
          placeholder="Filter cards"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-8 w-96"
        />
        <Button variant="secondary">
          <PlusCircleIcon className="mr-2 h-4 w-4" /> Add card
        </Button>
      </div>
      {filteredCards.map((card, index) => (
        <div key={index} className="mb-6">
          <div className="flex items-stretch space-x-4">
            {/* TODO make the hover on this have the different levels of colours*/}
            <div className="w-2 bg-green-500"></div>
            <Textarea
              className="aspect-[3/2] w-1/2 resize-none border p-2 scrollbar-thin scrollbar-track-background scrollbar-thumb-secondary"
              value={card.front}
              onChange={(e) => handleCardChange(index, "front", e.target.value)}
              placeholder="Front of the card"
            />
            <Textarea
              className="w-1/2 resize-none border p-2"
              value={card.back}
              onChange={(e) => handleCardChange(index, "back", e.target.value)}
              placeholder="Back of the card"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardEditor;
