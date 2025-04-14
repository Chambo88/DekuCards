import React, { memo, useRef } from "react";
import { Textarea } from "../ui/textarea";
import { createFlashCard, FlashCard } from "@/models/models";
import { MAX_FLASHCARD_CHAR } from "@/constants";
import CardTags from "./CardTags";
import useNodeStore from "@/stores/useTreeStore";

export interface CardEditorItemProps {
  dekuSetId: string;
  cardId: string;
  index: number;
}

const CardEditorItem: React.FC<CardEditorItemProps> = ({ dekuSetId, cardId }) => {
  const card = useNodeStore((state) =>
      state.setToCards[dekuSetId][cardId] || createFlashCard({set_id: dekuSetId})
  );
  const updateCard = useNodeStore((state) => state.updateCard);
  const frontRef = useRef<HTMLTextAreaElement>(null);
  const backRef = useRef<HTMLTextAreaElement>(null);

  const isFrontFocused = document.activeElement === frontRef.current;
  const isBackFocused = document.activeElement === backRef.current;
  const displayFrontEmpty = !isFrontFocused && card.front.trim().length === 0;
  const displayBackEmpty = !isFrontFocused && !isBackFocused && card.back.trim().length === 0;

  return (
    <div className={`pb-7 pt-3 ${card.selected ? "bg-popover" : card.enabled ? "" : "bg-code"}`}>
      <div className="mr-2 flex items-stretch space-x-4">
        <div className={`w-2 ${card.enabled ? "bg-green-500" : "bg-muted"}`} />
        <div className="relative flex aspect-[3/2] w-1/2 flex-col">
          <Textarea
            className={`h-full resize-none border ${displayFrontEmpty ? "border-destructive" : ""} p-2`}
            value={card.front}
            onChange={(e) => updateCard(dekuSetId, card.id, {front: e.target.value})}
            placeholder="Front of the card"
            ref={frontRef}
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
            className={`h-full resize-none border ${displayBackEmpty ? "border-destructive" : ""} p-2`}
            value={card.back}
            onChange={(e) =>  updateCard(dekuSetId, card.id, {back: e.target.value})}
            placeholder="Back of the card"
            ref={backRef}
            maxLength={MAX_FLASHCARD_CHAR}
          />
          {isBackFocused && (
            <p className="absolute -bottom-6 right-1 mt-2 text-sm text-muted-foreground">
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
          <CardTags dekuSetId={dekuSetId} card={card}/>
        </div>
      </div>
    </div>
  );
};

export default memo(CardEditorItem);
