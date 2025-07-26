import React, { useCallback, Dispatch, SetStateAction } from "react";
import useCardEditService from "@/services/useSetService";
import { calcLevel } from "@/helper/helperFunctions";
import { FlashCard, SessionInfo } from "@/models/models";
import ResultsCard from "./ResultsCard";
import QuestionAnswerCard from "./QuestionCard";
import CardTemplate from "./CardTemplate";

interface PanelProps {
  flashCard: FlashCard;
  indexInStack: number;
  isFrontTwo: boolean;
  onAdvance?: (isCorrect: boolean) => void;
  sessionData: SessionInfo[];
  setSessionData: Dispatch<SetStateAction<SessionInfo[]>>;
}

const Panel: React.FC<PanelProps> = ({
  flashCard,
  indexInStack,
  isFrontTwo,
  onAdvance,
  sessionData,
  setSessionData,
}) => {
  const style = {
    zIndex: 500 - indexInStack * 10,
    top: `calc(50% + ${indexInStack * 7}px)`,
    left: `calc(50% + ${indexInStack * 7}px)`,
    transition: "top 0.3s ease-out, left 0.3s ease-out",
  };

  const {
    handleCardCorrect: serviceHandleCardCorrect,
    handleCardWrong: serviceHandleCardWrong,
  } = useCardEditService();

  const handleUpdateSession = useCallback(
    async (isCorrect: boolean) => {
      setSessionData((prev) => {
        const newSessionData = [...prev];
        const lastIndex = newSessionData.length - 1;
        if (lastIndex < 0) return prev;
        const lastSession = newSessionData[lastIndex];

        const newCorrect = lastSession.correct + (isCorrect ? 1 : 0);
        const newWrong = lastSession.wrong + (isCorrect ? 0 : 1);

        newSessionData[lastIndex] = {
          ...lastSession,
          correct: newCorrect,
          wrong: newWrong,
          count: newCorrect + newWrong,
          level: calcLevel(newCorrect, newWrong),
        };
        return newSessionData;
      });

      if (onAdvance) {
        onAdvance(isCorrect);
      }

      if (isCorrect) {
        await serviceHandleCardCorrect(flashCard.set_id, flashCard);
      } else {
        await serviceHandleCardWrong(flashCard.set_id, flashCard);
      }
    },
    [
      flashCard,
      onAdvance,
      serviceHandleCardCorrect,
      serviceHandleCardWrong,
      setSessionData,
    ],
  );

  return (
    <div
      className="absolute h-[600px] w-[700px] -translate-x-1/2 -translate-y-1/2"
      style={style}
    >
      {flashCard.id === "analytics" ? (
        <ResultsCard sessionData={sessionData} />
      ) : isFrontTwo ? (
        <QuestionAnswerCard
          flashCard={flashCard}
          onCorrect={() => handleUpdateSession(true)}
          onWrong={() => handleUpdateSession(false)}
        />
      ) : (
        <CardTemplate></CardTemplate>
      )}
    </div>
  );
};

export default Panel;
