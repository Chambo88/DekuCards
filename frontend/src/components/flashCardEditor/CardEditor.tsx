import React, { useState, useMemo, useRef, useEffect, MutableRefObject, memo } from "react";
import { useShallow } from 'zustand/react/shallow'
import { Input } from "../ui/input";
import { EditorProps } from "./FlashCardDialog";
import { Textarea } from "../ui/textarea";
import { createFlashCard, FlashCard } from "@/models/models";
import { Button } from "../ui/button";
import { PlusCircleIcon } from "lucide-react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { v4 as uuidv4 } from "uuid";
import CardTags from "./CardTags";
import JsonDialog from "./JsonDialog";
import { MAX_FLASHCARD_CHAR } from "@/constants";
import useTreeStore from "@/stores/useTreeStore";
import CardEditorItem from "./CardEditorItem";


export interface CardEditorProps {
  dekuSetId: string;
  selectedCards: MutableRefObject<Set<string>>;
}

const CardEditor: React.FC<CardEditorProps> = ({ dekuSetId, selectedCards }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const lastCardFrontRef = useRef<HTMLTextAreaElement>(null);
  const lastCardBackRef = useRef<HTMLTextAreaElement>(null);
  const cardIds = useTreeStore(useShallow(state => 
    Object.keys(state.setToCards[dekuSetId] || {})
  ));
  const prevNumOfCards = useRef(cardIds.length);
  const textareaRefs = useRef<(HTMLTextAreaElement | null)[]>([]);

  const filteredCardIds = useMemo(() => {
    const cardRecord: Record<string, FlashCard> =
      useTreeStore.getState().setToCards[dekuSetId] || {};
  
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


  const handleAddCard = () => {
    const newCard = createFlashCard({set_id: dekuSetId});
    useTreeStore.getState().updateCard(dekuSetId, newCard.id, newCard);
  };

  // useEffect(() => {
  //   if (
  //     prevNumOfCards.current < cardSet.cards.length &&
  //     textareaRefs.current[textareaRefs.current.length - 1]
  //   ) {
  //     textareaRefs.current[textareaRefs.current.length - 1]!.scrollIntoView({
  //       behavior: "smooth",
  //     });

  //     const observer = new IntersectionObserver(
  //       (entries) => {
  //         if (entries[0].isIntersecting) {
  //           lastCardFrontRef.current?.focus();
  //           observer.disconnect();
  //         }
  //       },
  //       {
  //         threshold: 1.0,
  //       },
  //     );

  //     observer.observe(textareaRefs.current[textareaRefs.current.length - 1]!);
  //   }

  //   prevNumOfCards.current = cardIds.length;
  // }, [cardIds.length]);

  // useEffect(() => {
  //   const handleTabPress = (event: KeyboardEvent) => {
  //     if (event.key === "tab") {
  //     }
  //     if (
  //       event.key === "Tab" &&
  //       textareaRefs.current[textareaRefs.current.length - 1] ===
  //         document.activeElement
  //     ) {
  //       event.preventDefault();
  //       handleAddCard();
  //     }
  //   };

  //   if (textareaRefs.current[textareaRefs.current.length - 1]) {
  //     textareaRefs.current[textareaRefs.current.length - 1]!.addEventListener(
  //       "keydown",
  //       handleTabPress,
  //     );
  //   }

  //   return () => {
  //     if (textareaRefs.current[textareaRefs.current.length - 1]) {
  //       textareaRefs.current[
  //         textareaRefs.current.length - 1
  //       ]!.removeEventListener("keydown", handleTabPress);
  //     }
  //   };
  // }, [textareaRefs]);

  return (
    <div>
      <hr className="mx-6 mb-8 pl-10 font-semibold" />
      <div className="mx-6 flex flex-row justify-between">
        <Input
          placeholder="Filter cards"
          icon={<MagnifyingGlassIcon className="h-4 w-4"/>}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-8 w-96"
        />
        <div>
          <JsonDialog dekuSetId={dekuSetId}>
            <Button variant="secondary" className="mr-2">
              <PlusCircleIcon className="mr-2 h-4 w-4" /> Add cards via AI/JSON
            </Button>
          </JsonDialog>

          <Button variant="secondary" onClick={handleAddCard}>
            <PlusCircleIcon className="mr-2 h-4 w-4" /> Add card
          </Button>
        </div>
      </div>
      {filteredCardIds.map((cardId, index) => {
        return (
          <CardEditorItem key={cardId} dekuSetId={dekuSetId} cardId={cardId} index={index} />
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
