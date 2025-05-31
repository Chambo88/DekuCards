import React, { memo, useState, useCallback } from "react";
import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog";
import { Button } from "../ui/button";
import useTreeStore from "@/stores/useTreeStore";
import { useShallow } from "zustand/shallow";
import { FlashCard } from "@/models/models";
import { X } from "lucide-react";
import ReactCardFlip from "react-card-flip";

interface LearnDialogProps {}

interface PanelProps {
  flashCard: FlashCard;
  indexInStack: number;
  isFrontTwo: boolean;
  onAdvance?: () => void;
}

const Panel: React.FC<PanelProps> = ({
  flashCard,
  indexInStack,
  isFrontTwo,
  onAdvance,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="absolute h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2"
      style={{
        zIndex: 500 - indexInStack * 10,
        top: `calc(50% + ${indexInStack * 7}px)`,
        left: `calc(50% + ${indexInStack * 7}px)`,
      }}
    >
      {isFrontTwo ? (
        <ReactCardFlip
          isFlipped={isFlipped}
          flipDirection="horizontal"
          flipSpeedBackToFront={0.2}
          flipSpeedFrontToBack={0.2}
        >
          <div className="flex h-[700px] w-[700px] flex-col rounded-lg border-4 border-solid border-muted bg-background">
            <p className="m-4">Question: {flashCard.front}</p>

            <Button
              onClick={() => setIsFlipped(true)}
              variant="outline"
              className="absolute bottom-3 left-3 bg-blue-500 text-white hover:bg-blue-700"
            >
              Answer
            </Button>

            <DialogClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1 text-muted-foreground hover:bg-slate-700"
              >
                <X size={20} />
              </Button>
            </DialogClose>
          </div>

          <div className="flex h-[700px] w-[700px] flex-col rounded-lg border-4 border-solid border-muted bg-background">
            <p className="m-4">Answer: {flashCard.back}</p>

            {onAdvance && (
              <Button
                onClick={onAdvance}
                variant="outline"
                className="absolute bottom-3 left-3 bg-blue-500 text-white hover:bg-blue-700"
              >
                Next Card
              </Button>
            )}

            <DialogClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1 text-muted-foreground hover:bg-slate-700"
              >
                <X size={20} />
              </Button>
            </DialogClose>
          </div>
        </ReactCardFlip>
      ) : (
        <div className="flex h-[700px] w-[700px] flex-col rounded-lg border-4 border-solid border-muted bg-background"></div>
      )}
    </div>
  );
};

const LearnDialog: React.FC<LearnDialogProps> = () => {
  const nowMs = Date.now();
  const maxVisibleCards = 5;

  const allLearnCards = useTreeStore(
    useShallow((s) => {
      const out: FlashCard[] = [];
      for (const set of Object.values(s.dekuSets)) {
        if (set.enabled) {
          for (const card of Object.values(s.setToCards[set.id])) {
            if (card.available_date.getTime() <= nowMs && card.enabled) {
              out.push(card);
            }
          }
        }
      }
      return out.sort(
        (a, b) => a.available_date.getTime() - b.available_date.getTime(),
      );
    }),
  );

  const [showGreenFlashInstant, setShowGreenFlashInstant] = useState(false);

  const handleAdvanceCard = useCallback(() => {
    if (allLearnCards.length === 0) return;
    setShowGreenFlashInstant(true);
    setTimeout(() => {
      setShowGreenFlashInstant(false);
    }, 0);
  }, [allLearnCards]);

  return (
    <DialogContent className="flex items-center justify-center border-0 p-0">
      <div className="relative">
        <div
          className={`left-[calc(50% + 0*7px)] top-[calc(50% + 0*7px)] pointer-events-none absolute h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-chart-2 ${
            showGreenFlashInstant
              ? "opacity-45 transition-none"
              : "opacity-0 transition-opacity duration-500 ease-out"
          }`}
        />
        {allLearnCards.slice(0, maxVisibleCards).map((flashCard, index) => (
          <Panel
            key={flashCard.id}
            flashCard={flashCard}
            indexInStack={index}
            isFrontTwo={index === 0 || index == 1}
            onAdvance={handleAdvanceCard}
          />
        ))}
      </div>
    </DialogContent>
  );
};

export default memo(LearnDialog);
