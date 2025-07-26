import React, {
  memo,
  useState,
  useCallback,
  useMemo,
  useRef,
  MutableRefObject,
  useEffect,
  SetStateAction,
  Dispatch,
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
import { calcLevel, formatDateToYYYYMMDD } from "@/helper/helperFunctions";
import {
  ActivityCalendar,
  Props as CalendarProps,
  ThemeInput,
} from "react-activity-calendar";
import { ChartConfig, ChartContainer } from "../ui/chart";
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";
import { Tooltip as ReactTooltip } from "react-tooltip";

const MAX_CARDS = 5;
const BLOCK_DAYS = 365;

const labels = {
  totalCount: `{{count}} cards answered in the last ${BLOCK_DAYS} days.`,
  legend: {
    less: "",
    more: "",
  },
} satisfies CalendarProps["labels"];

const theme: ThemeInput = {
  light: ["#262626", "#a6daa6", "#73c573", "#3eaf3e", "#1a941a"],
  dark: ["#262626", "#a6daa6", "#73c573", "#3eaf3e", "#1a941a"],
};

interface LearnDialogProps {}

interface PanelProps {
  flashCard: FlashCard;
  indexInStack: number;
  isFrontTwo: boolean;
  onAdvance?: () => void;
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
  const [isFlipped, setIsFlipped] = useState(false);
  const {
    handleCardCorrect: serviceHandleCardCorrect,
    handleCardWrong: serviceHandleCardWrong,
  } = useCardEditService();
  const sessionLastIndex = sessionData.length - 1;

  const chartData = [
    {
      name: "CardResults",
      correct: sessionData[sessionLastIndex]?.correct ?? 0,
      fill: "#1a941a",
    },
  ];
  const lastSession = sessionData[sessionLastIndex];
  let endAngle = 0;
  let correct = 0;
  let wrong = 0;
  if (lastSession) {
    correct = lastSession.correct;
    wrong = lastSession.wrong;
    const total = correct + wrong;
    endAngle = total > 0 ? (lastSession.correct / total) * 360 : 0;
  }

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollLeft = container.scrollWidth;
    }
  }, [scrollContainerRef.current]);

  const onCorrect = async () => {
    setSessionData((prevSessionData) => {
      const newSessionData = [...prevSessionData];
      newSessionData[prevSessionData.length - 1] = {
        ...newSessionData[prevSessionData.length - 1],
        correct: newSessionData[prevSessionData.length - 1].correct + 1,
        level: calcLevel(
          newSessionData[prevSessionData.length - 1].correct + 1,
          newSessionData[prevSessionData.length - 1].wrong,
        ),
        count:
          newSessionData[prevSessionData.length - 1].correct +
          newSessionData[prevSessionData.length - 1].wrong +
          1,
      };
      return newSessionData;
    });

    if (onAdvance) onAdvance();
    await serviceHandleCardCorrect(flashCard.set_id, flashCard);
    setIsFlipped(false);
  };

  const onWrong = async () => {
    setSessionData((prevSessionData) => {
      const newSessionData = [...prevSessionData];
      newSessionData[prevSessionData.length - 1] = {
        ...newSessionData[prevSessionData.length - 1],
        wrong: newSessionData[prevSessionData.length - 1].wrong + 1,
        level: calcLevel(
          newSessionData[prevSessionData.length - 1].correct,
          newSessionData[prevSessionData.length - 1].wrong + 1,
        ),
        count:
          newSessionData[prevSessionData.length - 1].correct +
          newSessionData[prevSessionData.length - 1].wrong +
          1,
      };
      return newSessionData;
    });
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
          <div className="relative flex h-[600px] w-[700px] flex-col items-center rounded-lg border-2 border-solid border-muted bg-background p-4 shadow-[5px_5px_20px_0px_rgba(0,0,0,0.5)]">
            <div className="flex h-full w-full">
              <ChartContainer
                config={{}}
                className="mx-auto aspect-square max-h-[250px]"
              >
                <RadialBarChart
                  data={chartData}
                  startAngle={0}
                  endAngle={endAngle}
                  innerRadius={80}
                  outerRadius={110}
                >
                  <PolarGrid
                    gridType="circle"
                    radialLines={false}
                    stroke="none"
                    className="first:fill-muted last:fill-background"
                    polarRadius={[86, 74]}
                  />
                  <RadialBar dataKey="correct" background cornerRadius={10} />
                  <PolarRadiusAxis
                    tick={false}
                    tickLine={false}
                    axisLine={false}
                  >
                    <Label
                      content={({ viewBox }) => {
                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                          return (
                            <text
                              x={viewBox.cx}
                              y={viewBox.cy}
                              textAnchor="middle"
                              dominantBaseline="middle"
                            >
                              <tspan
                                x={viewBox.cx}
                                y={viewBox.cy}
                                className="fill-foreground text-4xl font-bold"
                              >
                                {`${correct}`}
                              </tspan>
                              <tspan className="fill-foreground text-xl">
                                {` / ${wrong + correct}`}
                              </tspan>
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy || 0) + 24}
                                className="fill-muted-foreground"
                              >
                                Today
                              </tspan>
                            </text>
                          );
                        }
                      }}
                    />
                  </PolarRadiusAxis>
                </RadialBarChart>
              </ChartContainer>
            </div>
            <div
              ref={scrollContainerRef}
              className="min-h-max w-full overflow-x-auto scrollbar-thin scrollbar-track-background scrollbar-thumb-secondary"
            >
              <div className="m-4 min-h-max min-w-max">
                {sessionData.length == 0 ? (
                  <ActivityCalendar
                    data={sessionData}
                    loading
                    blockMargin={4}
                    blockRadius={5}
                    blockSize={13}
                    labels={labels}
                    theme={theme}
                    hideColorLegend={true}
                    hideTotalCount={true}
                    renderBlock={(block, activity) => {
                      return React.cloneElement(block, {
                        "data-tooltip-id": "react-tooltip",
                        "data-tooltip-content": `${activity.date}`,
                        "data-tooltip-place": "top",
                      });
                    }}
                  />
                ) : (
                  <ActivityCalendar
                    data={sessionData}
                    blockMargin={4}
                    blockRadius={5}
                    blockSize={13}
                    labels={labels}
                    theme={theme}
                    hideColorLegend={true}
                    hideTotalCount={true}
                    renderBlock={(block, activity) =>
                      React.cloneElement(block, {
                        "data-tooltip-id": "react-tooltip",
                        "data-tooltip-content": `${activity.date}`,
                        "data-tooltip-place": "top",
                      })
                    }
                  />
                )}
              </div>
              <ReactTooltip
                id="react-tooltip"
                className="flex flex-col content-center justify-center"
                // Have to hard code styles as the className tailwind isnt resolving
                style={{
                  background: "hsl(0, 0%, 9%)",
                  border: "1px solid red",
                  borderRadius: "1.2rem",
                }}
                opacity={1}
                render={({ content }) => {
                  let session = sessionData.find(
                    (session) => session.date == content,
                  );
                  const chartDateData = [
                    {
                      name: "CardResults",
                      correct: session?.correct ?? 0,
                      fill: "#1a941a",
                    },
                  ];
                  let dateObj = new Date(content ?? "2021-01-02"); //content should never be undefined
                  const total = (session?.correct ?? 0) + (session?.wrong ?? 0);
                  let chartEndAngle =
                    total > 0 ? ((session?.correct ?? 0) / total) * 360 : 0;
                  return (
                    <>
                      <ChartContainer
                        config={{}}
                        className="m-0 aspect-square h-[90px] w-[90px] p-0"
                      >
                        <RadialBarChart
                          data={chartDateData}
                          startAngle={0}
                          endAngle={chartEndAngle}
                          innerRadius={40}
                          outerRadius={55}
                        >
                          <PolarGrid
                            gridType="circle"
                            radialLines={false}
                            stroke="none"
                            className="first:fill-muted last:fill-background"
                            polarRadius={[43, 37]}
                          />
                          <RadialBar
                            dataKey="correct"
                            background
                            cornerRadius={10}
                            isAnimationActive={false}
                          />
                          <PolarRadiusAxis
                            tick={false}
                            tickLine={false}
                            axisLine={false}
                          >
                            <Label
                              content={({ viewBox }) => {
                                if (
                                  viewBox &&
                                  "cx" in viewBox &&
                                  "cy" in viewBox
                                ) {
                                  return (
                                    <text
                                      x={viewBox.cx}
                                      y={viewBox.cy}
                                      textAnchor="middle"
                                      dominantBaseline="middle"
                                    >
                                      <tspan
                                        x={viewBox.cx}
                                        y={viewBox.cy}
                                        className="fill-foreground text-lg font-bold"
                                      >
                                        {`${session?.correct ?? 0}`}
                                      </tspan>
                                      <tspan className="fill-foreground text-xl">
                                        {` / ${(session?.wrong ?? 0) + (session?.correct ?? 0)}`}
                                      </tspan>
                                    </text>
                                  );
                                }
                              }}
                            />
                          </PolarRadiusAxis>
                        </RadialBarChart>
                      </ChartContainer>
                      <p className="mt-1 w-full text-center">
                        {dateObj.toLocaleDateString()}
                      </p>
                    </>
                  );
                }}
              />
            </div>
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

      console.log(data);

      const todaysFormattedDate = formatDateToYYYYMMDD(new Date());

      const oneYearAgo = new Date();
      oneYearAgo.setDate(oneYearAgo.getDate() - BLOCK_DAYS);
      const startFormattedDate = formatDateToYYYYMMDD(oneYearAgo);

      const lastSessionDate = data[data.length - 1]?.date;
      const firstSessionDate = data[0]?.date;

      if (!lastSessionDate || lastSessionDate !== todaysFormattedDate) {
        data.push({
          date: todaysFormattedDate,
          correct: 0,
          wrong: 0,
          level: calcLevel(0, 0),
          count: 0,
        });
      }

      if (!firstSessionDate || firstSessionDate >= startFormattedDate) {
        data.unshift({
          date: startFormattedDate,
          correct: 0,
          wrong: 0,
          level: calcLevel(0, 0),
          count: 0,
        });
      }

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
            onAdvance={handleAdvanceCard}
            sessionData={sessionData}
            setSessionData={setSessionData}
          />
        ))}
      </div>
    </DialogContent>
  );
};

// export default memo(LearnDialog);
