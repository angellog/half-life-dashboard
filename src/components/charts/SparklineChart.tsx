"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

interface SparklineChartProps {
  data: { date: string; followers: number }[];
  color?: string;
  height?: number;
}

export function SparklineChart({
  data,
  color = "hsl(150 60% 50%)",
  height = 32,
}: SparklineChartProps) {
  return (
    <div style={{ width: 80, height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line
            type="monotone"
            dataKey="followers"
            stroke={color}
            strokeWidth={1.5}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
