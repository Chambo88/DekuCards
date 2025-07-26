import React, { useState } from "react";
import { DialogClose } from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { FlashCard } from "@/models/models";
import { X, CheckIcon, RotateCcwIcon } from "lucide-react";
import ReactCardFlip from "react-card-flip";
import CardTemplate from "./CardTemplate";

const QuestionAnswerCard: React.FC<{
  flashCard: FlashCard;
  onCorrect: () => void;
  onWrong: () => void;
}> = ({ flashCard, onCorrect, onWrong }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <ReactCardFlip
      isFlipped={isFlipped}
      flipDirection="horizontal"
      flipSpeedBackToFront={0.2}
      flipSpeedFrontToBack={0.2}
    >
      <CardTemplate>
        <div className="m-4 mt-12 flex flex-grow-[16] items-center justify-center overflow-y-auto break-words scrollbar-thin scrollbar-track-background scrollbar-thumb-secondary">
          <p className="text-center text-lg">{flashCard.front}</p>
        </div>
        <div className="flex w-full flex-grow-[1] items-center justify-center p-2">
          <Button
            className="min-w-32"
            onClick={() => setIsFlipped(true)}
            variant="secondary"
          >
            <RotateCcwIcon size={20} />
          </Button>
        </div>
      </CardTemplate>

      <CardTemplate>
        <div className="m-4 mt-12 flex flex-grow-[16] items-center justify-center overflow-y-auto break-words scrollbar-thin scrollbar-track-background scrollbar-thumb-secondary">
          <p className="text-center text-lg">{flashCard.back}</p>
        </div>
        <div className="flex w-full flex-grow-[1] items-center justify-center gap-4 p-2">
          <Button className="min-w-32" variant="secondary" onClick={onWrong}>
            <X size={20} />
          </Button>
          <Button className="min-w-32" variant="secondary" onClick={onCorrect}>
            <CheckIcon size={20} />
          </Button>
        </div>
      </CardTemplate>
    </ReactCardFlip>
  );
};

export default QuestionAnswerCard;
