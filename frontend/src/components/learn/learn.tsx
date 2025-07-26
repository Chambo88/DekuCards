import React, { memo, useState, useCallback, useMemo, useEffect } from "react";
import { DialogContent } from "@/components/ui/dialog";
import useTreeStore from "@/stores/useTreeStore";
import { useShallow } from "zustand/shallow";
import { createFlashCard, FlashCard, SessionInfo } from "@/models/models";
import { getSessionData } from "@/api/userSessionApi";
import { formatDateToYYYYMMDD } from "@/helper/helperFunctions";
import Panel from "./Panel";

const MAX_CARDS = 5;
const BLOCK_DAYS = 365;

interface LearnDialogProps {}

const LearnDialog: React.FC<LearnDialogProps> = () => {
  const nowMs = Date.now();
  const [showGreenFlashInstant, setShowGreenFlashInstant] = useState(false);
  const [sessionData, setSessionData] = useState<SessionInfo[]>([]);

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

  // Get session data TODO move to store
  useEffect(() => {
    const getUserSessions = async () => {
      let data = await getSessionData();
      const todaysFormattedDate = formatDateToYYYYMMDD(new Date());

      const oneYearAgo = new Date();
      oneYearAgo.setDate(oneYearAgo.getDate() - BLOCK_DAYS);
      const startFormattedDate = formatDateToYYYYMMDD(oneYearAgo);

      const lastSessionDate = data.length ? data[data.length - 1].date : null;
      const firstSessionDate = data.length ? data[0].date : null;

      if (!lastSessionDate || lastSessionDate !== todaysFormattedDate) {
        data.push({
          date: todaysFormattedDate,
          correct: 0,
          wrong: 0,
          level: 0,
          count: 0,
        });
      }

      if (!firstSessionDate || firstSessionDate > startFormattedDate) {
        data.unshift({
          date: startFormattedDate,
          correct: 0,
          wrong: 0,
          level: 0,
          count: 0,
        });
      }

      setSessionData(data);
    };
    getUserSessions();
  }, []);

  // TODO This can probably be moved to the question cards somehow
  const handleAdvanceCard = useCallback(
    (isCorrect: boolean) => {
      if (allLearnCards.length === 0) return;
      if (isCorrect) {
        setShowGreenFlashInstant(true);
        setTimeout(() => {
          setShowGreenFlashInstant(false);
        }, 0);
      }
    },
    [allLearnCards.length],
  );

  return (
    <DialogContent className="flex items-center justify-center border-0 p-0">
      <div className="relative">
        <div
          className={`pointer-events-none absolute z-[2000] h-[600px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-chart-2 ${
            showGreenFlashInstant
              ? "opacity-45 transition-none"
              : "opacity-0 transition-opacity duration-500 ease-out"
          }`}
          style={{ top: "50%", left: "50%" }}
        />
        {allLearnCards.slice(0, MAX_CARDS).map((flashCard, index) => (
          <Panel
            key={flashCard.id}
            flashCard={flashCard}
            indexInStack={index}
            isFrontTwo={index < 2}
            onAdvance={handleAdvanceCard}
            sessionData={sessionData}
            setSessionData={setSessionData}
          />
        ))}
      </div>
    </DialogContent>
  );
};

export default memo(LearnDialog);
