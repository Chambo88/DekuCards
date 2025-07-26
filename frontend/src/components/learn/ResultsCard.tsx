import React, { useMemo, useRef, useEffect } from "react";
import {
  ActivityCalendar,
  Props as CalendarProps,
  ThemeInput,
} from "react-activity-calendar";
import { ChartContainer } from "../ui/chart";
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";
import { Tooltip as ReactTooltip } from "react-tooltip";
import CardTemplate from "./CardTemplate";
import { SessionInfo } from "@/models/models";

const BLOCK_DAYS = 365;

const labels = {
  totalCount: `{{count}} cards answered in the last ${BLOCK_DAYS} days.`,
  legend: { less: "", more: "" },
} satisfies CalendarProps["labels"];

const theme: ThemeInput = {
  light: ["#262626", "#a6daa6", "#73c573", "#3eaf3e", "#1a941a"],
  dark: ["#262626", "#a6daa6", "#73c573", "#3eaf3e", "#1a941a"],
};

const ResultsCard: React.FC<{ sessionData: SessionInfo[] }> = ({
  sessionData,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollLeft = container.scrollWidth;
    }
  }, []);

  const { correct, wrong, endAngle, chartData } = useMemo(() => {
    const lastSession = sessionData.length
      ? sessionData[sessionData.length - 1]
      : null;
    const correct = lastSession?.correct ?? 0;
    const wrong = lastSession?.wrong ?? 0;
    const total = correct + wrong;
    const endAngle = total > 0 ? (correct / total) * 360 : 0;
    const chartData = [
      { name: "CardResults", correct: correct, fill: "#1a941a" },
    ];
    return { correct, wrong, total, endAngle, chartData };
  }, [sessionData]);

  const activityCalendarProps = {
    data: sessionData,
    blockMargin: 4,
    blockRadius: 5,
    blockSize: 13,
    labels,
    theme,
    hideColorLegend: true,
    hideTotalCount: true,
    renderBlock: (block: React.ReactElement, activity: { date: string }) =>
      React.cloneElement(block, {
        "data-tooltip-id": "react-tooltip",
        "data-tooltip-content": activity.date,
        "data-tooltip-place": "top",
      }),
  };

  return (
    <CardTemplate>
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
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
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
                        <tspan className="fill-foreground text-xl">{` / ${correct + wrong}`}</tspan>
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
      <div className="m-8">
        <div
          ref={scrollContainerRef}
          className="min-h-max w-full overflow-x-auto scrollbar-thin scrollbar-track-background scrollbar-thumb-secondary"
        >
          <div className="m-4 min-h-max min-w-max">
            <ActivityCalendar
              {...activityCalendarProps}
              loading={sessionData.length === 0}
            />
          </div>
        </div>
      </div>
      <ReactTooltip
        id="react-tooltip"
        className="flex flex-col content-center justify-center"
        style={{
          background: "hsl(0, 0%, 9%)",
          border: "1px solid red",
          borderRadius: "1.2rem",
        }}
        opacity={1}
        render={({ content }) => (
          <CalendarTooltipContent content={content} sessionData={sessionData} />
        )}
      />
    </CardTemplate>
  );
};
export default ResultsCard;

const CalendarTooltipContent: React.FC<{
  content?: string | null;
  sessionData: SessionInfo[];
}> = ({ content, sessionData }) => {
  const session = useMemo(
    () => sessionData.find((s) => s.date === content),
    [sessionData, content],
  );

  const { chartDateData, chartEndAngle, total, correct, wrong } =
    useMemo(() => {
      const correct = session?.correct ?? 0;
      const wrong = session?.wrong ?? 0;
      const total = correct + wrong;
      const chartEndAngle = total > 0 ? (correct / total) * 360 : 0;
      const chartDateData = [{ name: "CardResults", correct, fill: "#1a941a" }];
      return { chartDateData, chartEndAngle, total, correct, wrong };
    }, [session]);

  if (!content) return null;

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
          <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
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
                        className="fill-foreground text-lg font-bold"
                      >
                        {`${correct}`}
                      </tspan>
                      <tspan className="fill-foreground text-xl">{` / ${total}`}</tspan>
                    </text>
                  );
                }
              }}
            />
          </PolarRadiusAxis>
        </RadialBarChart>
      </ChartContainer>
      <p className="mt-1 w-full text-center">
        {new Date(content).toLocaleDateString()}
      </p>
    </>
  );
};
