import React, {
  memo,
  useState,
  useCallback,
  useMemo,
  useRef,
  MutableRefObject,
  useEffect,
} from "react";
import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog";
import { Button } from "../ui/button";
import useTreeStore from "@/stores/useTreeStore";
import { useShallow } from "zustand/shallow";
import { createFlashCard, FlashCard, SessionInfo } from "@/models/models";
import { X, CheckIcon, RotateCcwIcon } from "lucide-react";
import ReactCardFlip from "react-card-flip";
import useCardEditService from "@/services/useSetService";
import { result } from "lodash";
import { getSessionData } from "@/api/userSessionApi";

const MAX_CARDS = 5;

interface LearnDialogProps {}

interface PanelProps {
  flashCard: FlashCard;
  indexInStack: number;
  isFrontTwo: boolean;
  results: MutableRefObject<{ Correct: number; Wrong: number }>;
  onAdvance?: () => void;
  sessionData: SessionInfo;
}
const Panel: React.FC<PanelProps> = ({
  flashCard,
  indexInStack,
  isFrontTwo,
  results,
  onAdvance,
  sessionData,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const {
    handleCardCorrect: serviceHandleCardCorrect,
    handleCardWrong: serviceHandleCardWrong,
  } = useCardEditService();

  const onCorrect = async () => {
    results.current.Correct++;
    if (onAdvance) onAdvance();
    await serviceHandleCardCorrect(flashCard.set_id, flashCard);
    setIsFlipped(false);
  };

  const onWrong = async () => {
    results.current.Wrong++;
    await serviceHandleCardWrong(flashCard.set_id, flashCard);
    setIsFlipped(false);
  };

  return (
    <div
      className="absolute h-[600px] w-[700px] -translate-x-1/2 -translate-y-1/2"
      style={{
        zIndex: 500 - indexInStack * 10,
        top: `calc(50% + ${indexInStack * 7}px)`,
        left: `calc(50% + ${indexInStack * 7}px)`,
        transition: "top 0.3s ease-out, left 0.3s ease-out",
      }}
    >
      {flashCard.id === "analytics" ? (
        <div>
          <div className="relative flex h-[600px] w-[700px] flex-col rounded-lg border-2 border-solid border-muted bg-background p-0 shadow-[5px_5px_20px_0px_rgba(0,0,0,0.5)]">
            <p className="m-4 mt-12 text-center text-lg">
              {results.current.Correct}
            </p>
          </div>
        </div>
      ) : isFrontTwo ? (
        <ReactCardFlip
          isFlipped={isFlipped}
          flipDirection="horizontal"
          flipSpeedBackToFront={0.2}
          flipSpeedFrontToBack={0.2}
        >
          <div className="relative flex h-[600px] w-[700px] flex-col rounded-lg border-2 border-solid border-muted bg-background p-0 shadow-[5px_5px_20px_0px_rgba(0,0,0,0.5)]">
            <DialogClose asChild className="absolute right-0 top-0 z-[1010]">
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1 text-muted-foreground"
              >
                <X size={20} />
              </Button>
            </DialogClose>
            <div className="m-4 mt-12 flex flex-grow-[16] items-center justify-center overflow-y-auto break-words scrollbar-thin scrollbar-track-background scrollbar-thumb-secondary">
              <p className="text-center text-lg"> {flashCard.front}</p>
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
          </div>

          <div className="relative flex h-[600px] w-[700px] flex-col rounded-lg border-2 border-solid border-muted bg-popover p-0 shadow-[5px_5px_20px_0px_rgba(0,0,0,0.5)]">
            <DialogClose asChild className="absolute right-0 top-0 z-[1010]">
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1 text-muted-foreground"
              >
                <X size={20} />
              </Button>
            </DialogClose>
            <div className="m-4 mt-12 flex flex-grow-[16] items-center justify-center overflow-y-auto break-words scrollbar-thin scrollbar-track-background scrollbar-thumb-secondary">
              <p className="text-center text-lg"> {flashCard.back}</p>
            </div>
            <div className="flex w-full flex-grow-[1] items-center justify-center gap-4 p-2">
              <Button
                className="min-w-32"
                variant="secondary"
                onClick={onWrong}
              >
                <X size={20} />
              </Button>
              <Button
                className="min-w-32"
                variant="secondary"
                onClick={onCorrect}
              >
                <CheckIcon size={20} />
              </Button>
            </div>
          </div>
        </ReactCardFlip>
      ) : (
        <div
          className={`relative flex h-[600px] w-[700px] flex-col rounded-lg border-2 border-solid border-muted bg-background p-0 shadow-[5px_5px_15px_0px_rgba(0,0,0,0.5)]`}
        ></div>
      )}
    </div>
  );
};

const LearnDialog: React.FC<LearnDialogProps> = () => {
  const nowMs = Date.now();

  const [showGreenFlashInstant, setShowGreenFlashInstant] = useState(false);
  const [sessionData, setSessionData] = useState<SessionInfo[]>([]);
  const results = useRef({ Correct: 0, Wrong: 0 });

  const analyticsCard = useMemo(
    () => createFlashCard({ id: "analytics", set_id: "analytics" }),
    [],
  );

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
      out.sort(
        (a, b) => a.available_date.getTime() - b.available_date.getTime(),
      );
      out.push(analyticsCard);
      return out;
    }),
  );

  useEffect(() => {
    const getUserSessions = async () => {
      let data = await getSessionData();
      setSessionData(data);
    };
    getUserSessions();
  }, []);

  const learnCardsLength = allLearnCards.length;
  const handleAdvanceCard = useCallback(() => {
    if (learnCardsLength === 0) {
      return;
    }
    setShowGreenFlashInstant(true);
    setTimeout(() => {
      setShowGreenFlashInstant(false);
    }, 0);
  }, [learnCardsLength]);

  return (
    <DialogContent className="flex items-center justify-center border-0 p-0">
      <div className="relative">
        <div
          className={`pointer-events-none absolute z-[1000] h-[600px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-chart-2 ${
            showGreenFlashInstant
              ? "opacity-45 transition-none"
              : "opacity-0 transition-opacity duration-500 ease-out"
          }`}
          style={{
            top: `calc(50%)`,
            left: `calc(50%)`,
          }}
        />
        {allLearnCards.slice(0, MAX_CARDS).map((flashCard, index) => (
          <Panel
            key={flashCard.id}
            flashCard={flashCard}
            indexInStack={index}
            isFrontTwo={index === 0 || index == 1}
            results={results}
            onAdvance={handleAdvanceCard}
            sessionData={sessionData}
          />
        ))}
      </div>
    </DialogContent>
  );
};

export default memo(LearnDialog);
