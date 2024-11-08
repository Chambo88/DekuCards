import React, { useState, useMemo, useRef, useEffect } from "react";
import { Input } from "../ui/input";
import { EditorProps } from "./FlashCardDialog";
import { Textarea } from "../ui/textarea";
import { Card } from "@/models/cardSet";
import { Button } from "../ui/button";
import { PlusCircleIcon } from "lucide-react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const CardEditor: React.FC<EditorProps> = ({ cardSet, setCardSet }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [newCardAdded, setNewCardAdded] = useState(false);
  const lastCardFrontRef = useRef<HTMLTextAreaElement>(null);
  const lastCardBackRef = useRef<HTMLTextAreaElement>(null);

  const filteredCards = useMemo(() => {
    if (!searchTerm.trim()) {
      return cardSet.cards.map((card, index) => ({ card, index }));
    }
    const search = searchTerm.toLowerCase();
    return cardSet.cards
      .map((card, index) => ({ card, index }))
      .filter(({ card }) => {
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

  const handleAddCard = () => {
    const newCard: Card = { front: "", back: "" };
    setCardSet((prevCardSet) => ({
      ...prevCardSet,
      cards: [...prevCardSet.cards, newCard],
    }));
    setNewCardAdded(true);
  };

  useEffect(() => {
    if (newCardAdded && lastCardFrontRef.current) {
      lastCardFrontRef.current.scrollIntoView({ behavior: "smooth" });

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            lastCardFrontRef.current?.focus();
            observer.disconnect();
          }
        },
        {
          threshold: 1.0,
        },
      );

      observer.observe(lastCardFrontRef.current);

      setNewCardAdded(false);
    }
  }, [cardSet.cards, newCardAdded]);

  useEffect(() => {
    const handleTabPress = (event: KeyboardEvent) => {
      if (
        event.key === "Tab" &&
        lastCardBackRef.current === document.activeElement
      ) {
        event.preventDefault();
        handleAddCard();
      }
    };

    if (lastCardBackRef.current) {
      lastCardBackRef.current.addEventListener("keydown", handleTabPress);
    }

    return () => {
      if (lastCardBackRef.current) {
        lastCardBackRef.current.removeEventListener("keydown", handleTabPress);
      }
    };
  }, [lastCardBackRef.current]);

  return (
    <div>
      <hr className="mx-6 mb-8 pl-10 font-semibold" />
      <div className="mx-6 flex flex-row justify-between">
        <Input
          placeholder="Filter cards"
          icon={<MagnifyingGlassIcon className="h-4 w-4" aria-hidden="true" />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-8 w-96"
        />
        <Button variant="secondary" onClick={handleAddCard}>
          <PlusCircleIcon className="mr-2 h-4 w-4" /> Add card
        </Button>
      </div>
      {filteredCards.map(({ card, index }) => {
        const isLastCard = index === cardSet.cards.length - 1;
        return (
          <div key={index} className="mb-6">
            <div className="flex items-stretch space-x-4">
              {/* TODO make the hover on this have the different levels of colours*/}
              <div className="w-2 bg-green-500"></div>
              <Textarea
                className="aspect-[3/2] w-1/2 resize-none border p-2 scrollbar-thin scrollbar-track-background scrollbar-thumb-secondary"
                value={card.front}
                onChange={(e) =>
                  handleCardChange(index, "front", e.target.value)
                }
                placeholder="Front of the card"
                ref={isLastCard ? lastCardFrontRef : null}
              />
              <Textarea
                className="aspect-[3/2] w-1/2 resize-none border p-2 scrollbar-thin scrollbar-track-background scrollbar-thumb-secondary"
                value={card.back}
                onChange={(e) =>
                  handleCardChange(index, "back", e.target.value)
                }
                placeholder="Back of the card"
                ref={isLastCard ? lastCardBackRef : null}
              />
              <div className="w-2"></div>
            </div>
          </div>
        );
      })}
      <div className="mb-10 flex w-full justify-center">
        <div
          onClick={handleAddCard}
          className="flex aspect-[3/2] w-1/2 flex-col items-center justify-center rounded-md border ring-offset-background hover:cursor-pointer hover:outline-none hover:ring-2 hover:ring-ring hover:ring-offset-2"
        >
          <div className="flex-1"></div>
          <PlusCircleIcon className="mb-2 h-12 w-12" />
          <h3> Add Card</h3>
          <div className="flex flex-1 items-start">
            <p className="mt-10 text-sm text-muted-foreground">
              Hint: Press Tab to navigate quicker and create new cards
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardEditor;
