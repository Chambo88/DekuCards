import React, { memo, useState, useEffect, useCallback, useRef } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import useTreeStore from "@/stores/useTreeStore";
import { shallow, useShallow } from "zustand/shallow";
import { FlashCard } from "@/models/models";
import { PieChart, Pie, Cell, Legend } from "recharts";
import { X } from "lucide-react";

interface LearnDialogProps {
  // close: () => void;
}

const CARD_MODE = {
  LEARN: "learn",
  PRACTICE: "practice",
  RESULT: "result",
} as const;

type CardMode = (typeof CARD_MODE)[keyof typeof CARD_MODE];

const LearnDialog: React.FC<LearnDialogProps> = () => {
  const nowMs = Date.now();

  const learnCards = useTreeStore(
    useShallow((s) => {
      const out: FlashCard[] = [];
      for (const setMap of Object.values(s.setToCards)) {
        for (const card of Object.values(setMap)) {
          if (card.available_date.getTime() <= nowMs) {
            out.push(card);
          }
        }
      }
      return out;
    }),
  );

  const practiceCards = useTreeStore(
    useShallow((s) => {
      const out: FlashCard[] = [];
      for (const setMap of Object.values(s.setToCards)) {
        for (const card of Object.values(setMap)) {
          if (card.available_date.getTime() > nowMs) {
            out.push(card);
          }
        }
      }
      return out;
    }),
  );
  const learnCardTotal = useRef<number>(learnCards.length);

  const [mode, setMode] = useState<CardMode>(CARD_MODE.LEARN);
  const [fromLearn, setFromLearn] = useState(false);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  const currentList = mode === CARD_MODE.LEARN ? learnCards : practiceCards;
  const currentCard = currentList[index];
  console.log(JSON.stringify(currentCard));
  const total = currentList.length;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!currentCard) return;
      if (!flipped && e.key === "Enter") {
        setFlipped(true);
      } else if (flipped) {
        if (e.key === "Enter") {
          mark(true);
        } else if (e.key === "Backspace") {
          mark(false);
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [flipped, currentCard, index, mode, correctCount]);

  const mark = (isCorrect: boolean) => {
    if (isCorrect) setCorrectCount((c) => c + 1);
    setFlipped(false);
    const nextIndex = index + 1;
    if (nextIndex >= total) {
      setMode(CARD_MODE.RESULT);
    } else {
      setIndex(nextIndex);
    }
  };

  const handleFlip = () => setFlipped((f) => !f);

  const handleContinue = () => {
    setMode(CARD_MODE.PRACTICE);
    setIndex(0);
    setCorrectCount(0);
    setFlipped(false);
  };

  const handleClose = () => {
    close();
  };

  const pieData = [
    { name: "Correct", value: correctCount },
    { name: "Wrong", value: total - correctCount },
  ];
  const COLORS = ["#4ADE80", "#F87171"];

  return (
    <DialogContent
      tabIndex={-1}
      className="flex flex-col bg-background p-4 sm:max-h-[80vh] sm:max-w-[600px] sm:rounded-lg sm:shadow-lg"
    >
      <div className="flex flex-col min-w-[700px] min-h-[500px]">
        <DialogHeader className="relative w-full">
          <DialogTitle asChild>
            <div className="relative flex w-full items-center justify-center px-0">
              <h6 className="absolute left-0 text-muted-foreground">
                {mode === CARD_MODE.LEARN ? "Learn" : "Practice"}
              </h6>
              <h2 className="text-xl font-semibold">
                {`${index + 1}/${learnCardTotal.current}`}
              </h2>
              <DialogClose asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 text-muted-foreground"
                >
                  <X />
                </Button>
              </DialogClose>
            </div>
          </DialogTitle>
        </DialogHeader>

        {mode === CARD_MODE.RESULT ? (
          <div className="flex flex-col h-full w-full items-center justify-center p-4">
            <PieChart width={200} height={200}>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Legend verticalAlign="bottom" />
            </PieChart>
            <Button
              className="mt-4"
              onClick={fromLearn ? handleContinue : handleClose}
            >
              {fromLearn ? "Continue Practicing" : "Done"}
            </Button>
          </div>
        ) : (
          currentCard && (
            <div className="flex flex-col items-center justify-center p-4">
              <div className="w-full rounded-md border p-6 text-center shadow-md">
                <p className="text-lg">
                  {flipped ? currentCard.back : currentCard.front}
                </p>
              </div>
            </div>
          )
        )}
      </div>

      <DialogFooter className="p-4">
        <div className="mt-4 flex space-x-4">
          {!flipped ? (
            <Button onClick={handleFlip}>Flip Card</Button>
          ) : (
            <>
              <Button onClick={() => mark(true)}>Correct</Button>
              <Button variant="destructive" onClick={() => mark(false)}>
                Incorrect
              </Button>
            </>
          )}
        </div>
      </DialogFooter>
    </DialogContent>
  );
};

export default memo(LearnDialog);
