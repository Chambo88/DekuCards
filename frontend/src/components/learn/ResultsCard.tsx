import React, { useMemo, useRef, useEffect } from "react";
import {
  ActivityCalendar,
  Props as CalendarProps,
  ThemeInput,
} from "react-activity-calendar";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
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
import useTreeStore from "@/stores/useTreeStore";
import { useShallow } from "zustand/react/shallow";
import { TrendingUp } from "lucide-react";
import { Pie, PieChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
  const treeData = useTreeStore(
    useShallow((state) => {
      let newCardData: { [score: number]: number } = {};
      for (const setValue of Object.values(state.setToCards)) {
        for (const card of Object.values(setValue)) {
          const score = card.health;

          if (newCardData[score]) {
            newCardData[score]++;
          } else {
            newCardData[score] = 1;
          }
        }
      }
      return newCardData;
    }),
  );

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
      <div className="flex w-full flex-row items-center">
        <div className="flex w-1/2 justify-center">
          <ChartContainer
            config={{}}
            className="mx-auto aspect-square h-[250px]"
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
        <div className="flex w-1/2 justify-center">
          <ChartPieLabel />
        </div>
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

const chartData = [
  { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
  { browser: "other", visitors: 90, fill: "var(--color-other)" },
];
const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "var(--chart-1)",
  },
  safari: {
    label: "Safari",
    color: "var(--chart-2)",
  },
  firefox: {
    label: "Firefox",
    color: "var(--chart-3)",
  },
  edge: {
    label: "Edge",
    color: "var(--chart-4)",
  },
  other: {
    label: "Other",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig;

const ChartPieLabel = () => {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Pie Chart - Label</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] pb-0 [&_.recharts-pie-label-text]:fill-foreground"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie data={chartData} dataKey="visitors" label nameKey="browser" />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
};
