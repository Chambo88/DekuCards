import React, { useState, useMemo, useRef, useEffect, MutableRefObject, memo } from "react";
import { Input } from "../ui/input";
import { EditorProps } from "./FlashCardDialog";
import { Textarea } from "../ui/textarea";
import { FlashCard } from "@/models/models";
import { Button } from "../ui/button";
import { PlusCircleIcon } from "lucide-react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { v4 as uuidv4 } from "uuid";
import CardTags from "./CardTags";
import JsonDialog from "./JsonDialog";
import { MAX_FLASHCARD_CHAR } from "@/constants";
import useNodeStore from "@/stores/useTreeStore";


export interface CardEditorProps {
  dekuSetId: string;
  selectedCards: MutableRefObject<Set<string>>;
}

const CardEditor: React.FC<CardEditorProps> = ({ dekuSetId, selectedCards }) => {
  const [searchTerm, setSearchTerm] = useState("");
  // const cards: Record<string, FlashCard> = useNodeStore(
  //   (state) => state.setToCards[dekuSetId] ?? []
  // );
  const lastCardFrontRef = useRef<HTMLTextAreaElement>(null);
  const lastCardBackRef = useRef<HTMLTextAreaElement>(null);
  const cardIds = useNodeStore((state) =>
    Object.keys(state.setToCards[dekuSetId] || {})
  );
  const prevNumOfCards = useRef(cardIds.length);
  const textareaRefs = useRef<(HTMLTextAreaElement | null)[]>([]);


  const filteredCardIds = useMemo(() => {
    const cardRecord: Record<string, FlashCard> =
      useNodeStore.getState().setToCards[dekuSetId] || {};
  
    let entries = Object.entries(cardRecord);
  
    entries.sort(([, cardA], [, cardB]) => {
      return cardA.created_at.getTime() - cardB.created_at.getTime();
    });
  
    if (!searchTerm.trim()) {
      return entries.map(([cardId]) => cardId);
    }
  
    const filtered = entries.filter(([, card]) =>
      card.front.includes(searchTerm) || card.back.includes(searchTerm)
    );
  
    return filtered.map(([cardId]) => cardId);
  }, [dekuSetId, searchTerm, cardIds.join(",")]);

  const handleCardChange = (
    index: number,
    field: keyof FlashCard,
    value: string,
  ) => {
    const updatedCards = [...cardSet.cards];
    updatedCards[index] = { ...updatedCards[index], [field]: value };
    setCardSet({ ...cardSet, cards: updatedCards });
  };

  const handleAddCard = () => {
    const newCard: FlashCard = {
      front: "",
      back: "",
      enabled: true,
      selected: false,
      id: uuidv4(),
    };
    setCardSet((prevCardSet) => ({
      ...prevCardSet,
      cards: [...prevCardSet.cards, newCard],
    }));
  };

  useEffect(() => {
    if (
      prevNumOfCards.current < cardSet.cards.length &&
      textareaRefs.current[textareaRefs.current.length - 1]
    ) {
      textareaRefs.current[textareaRefs.current.length - 1]!.scrollIntoView({
        behavior: "smooth",
      });

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

      observer.observe(textareaRefs.current[textareaRefs.current.length - 1]!);
    }

    prevNumOfCards.current = cardIds.length;
  }, [cardIds.length]);

  useEffect(() => {
    const handleTabPress = (event: KeyboardEvent) => {
      if (event.key === "tab") {
      }
      if (
        event.key === "Tab" &&
        textareaRefs.current[textareaRefs.current.length - 1] ===
          document.activeElement
      ) {
        event.preventDefault();
        handleAddCard();
      }
    };

    if (textareaRefs.current[textareaRefs.current.length - 1]) {
      textareaRefs.current[textareaRefs.current.length - 1]!.addEventListener(
        "keydown",
        handleTabPress,
      );
    }

    return () => {
      if (textareaRefs.current[textareaRefs.current.length - 1]) {
        textareaRefs.current[
          textareaRefs.current.length - 1
        ]!.removeEventListener("keydown", handleTabPress);
      }
    };
  }, [textareaRefs]);

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
        <div>
          <JsonDialog setCardSet={setCardSet} cardSet={cardSet}>
            <Button variant="secondary" className="mr-2">
              <PlusCircleIcon className="mr-2 h-4 w-4" /> Add cards via AI/JSON
            </Button>
          </JsonDialog>

          <Button variant="secondary" onClick={handleAddCard}>
            <PlusCircleIcon className="mr-2 h-4 w-4" /> Add card
          </Button>
        </div>
      </div>
      {filteredCards.map(({ card, index }) => {
        const isFrontFocused =
          textareaRefs.current[index * 2] == document.activeElement;
        const isBackFocused =
          textareaRefs.current[index * 2 + 1] == document.activeElement;
        const displayFrontEmpty =
          !isFrontFocused && card.front.trim().length == 0;
        const displayBackEmpty =
          !isFrontFocused && !isBackFocused && card.back.trim().length == 0;

        return (
          <div
            key={index}
            className={`pb-7 pt-3 ${card.selected ? "bg-popover" : card.enabled ? "" : "bg-code"} `}
          >
            <div className="mr-2 flex items-stretch space-x-4">
              <div
                className={`w-2 ${card.enabled ? "bg-green-500" : "bg-muted"}`}
              ></div>

              <div className="relative flex aspect-[3/2] w-1/2 flex-col">
                <Textarea
                  className={`h-full resize-none border ${displayFrontEmpty ? "border-destructive" : ""} p-2 scrollbar-thin scrollbar-track-background scrollbar-thumb-secondary ${card.enabled ? "" : "text-muted-foreground"}`}
                  value={card.front}
                  onChange={(e) =>
                    handleCardChange(index, "front", e.target.value)
                  }
                  placeholder="Front of the card"
                  ref={(el) => (textareaRefs.current[index * 2] = el)}
                  maxLength={MAX_FLASHCARD_CHAR}
                />
                {isFrontFocused && (
                  <p className="absolute -bottom-6 right-1 mt-2 text-sm text-muted-foreground">
                    {card.front.length} / {MAX_FLASHCARD_CHAR}
                  </p>
                )}

                {displayFrontEmpty && (
                  <p className="absolute -bottom-6 left-1 mt-2 text-sm text-red-500">
                    Card needs content
                  </p>
                )}
              </div>

              <div className="relative flex aspect-[3/2] w-1/2 flex-col">
                <Textarea
                  className={`h-full resize-none border ${displayBackEmpty ? "border-destructive" : ""} p-2 scrollbar-thin scrollbar-track-background scrollbar-thumb-secondary ${card.enabled ? "" : "text-muted-foreground"}`}
                  value={card.back}
                  onChange={(e) =>
                    handleCardChange(index, "back", e.target.value)
                  }
                  placeholder="Back of the card"
                  ref={(el) => (textareaRefs.current[index * 2 + 1] = el)}
                  maxLength={MAX_FLASHCARD_CHAR}
                />
                {isBackFocused && (
                  <p
                    className="absolute -bottom-6 right-1 mt-2 text-sm text-muted-foreground"
                    tabIndex={-1}
                  >
                    {card.back.length} / {MAX_FLASHCARD_CHAR}
                  </p>
                )}
                {displayBackEmpty && (
                  <p className="absolute -bottom-6 left-1 mt-2 text-sm text-red-500">
                    Card needs content
                  </p>
                )}
              </div>
              <div className="mr-5 flex flex-col gap-2">
                <CardTags
                  setCardSet={setCardSet}
                  cardSet={cardSet}
                  card={card}
                />
              </div>
            </div>
          </div>
        );
      })}
      <div className="mb-10 mt-4 flex w-full justify-center">
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

export default memo(CardEditor);
