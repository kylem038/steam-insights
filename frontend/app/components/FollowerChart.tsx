"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

interface DataPoint {
  followers: number;
  timestamp: string;
}

const chartConfig = {
  followers: {
    label: "Followers",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

function formatTime(ms: number) {
  const d = new Date(ms);
  return (
    d.toLocaleDateString(undefined, { month: "short", day: "numeric" }) +
    " " +
    d.getHours() +
    ":00"
  );
}

function formatTimeFull(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatNumber(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

export function FollowerChart({ data }: { data: DataPoint[] }) {
  if (data.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-xs text-zinc-400 dark:text-zinc-600">
            No follower data yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  const chartData = data.map((d) => ({
    ...d,
    time: new Date(d.timestamp).getTime(),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Follower Count History</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <AreaChart data={chartData} accessibilityLayer>
            <defs>
              <linearGradient id="followerGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-followers)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="var(--color-followers)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="time"
              type="number"
              scale="time"
              domain={["dataMin", "dataMax"]}
              tickFormatter={formatTime}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
            />
            <YAxis
              tickFormatter={formatNumber}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(_label, payload) => {
                    const entry = (payload as unknown[])?.[0] as
                      | { payload?: Record<string, unknown> }
                      | undefined;
                    if (!entry) return "";
                    const ts = entry.payload?.timestamp;
                    return typeof ts === "string" ? formatTimeFull(ts) : "";
                  }}
                />
              }
            />
            <Area
              type="monotone"
              dataKey="followers"
              stroke="var(--color-followers)"
              fill="url(#followerGradient)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
