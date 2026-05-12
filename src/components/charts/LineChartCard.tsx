"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

interface LineChartCardProps {
  title: string;
  description?: string;
  data: { date: string; followers: number }[];
}

export function LineChartCard({ title, description, data }: LineChartCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 20%)" />
              <XAxis
                dataKey="date"
                tick={{ fill: "hsl(0 0% 63.9%)", fontSize: 11 }}
                axisLine={{ stroke: "hsl(0 0% 20%)" }}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <YAxis
                tick={{ fill: "hsl(0 0% 63.9%)", fontSize: 12 }}
                axisLine={{ stroke: "hsl(0 0% 20%)" }}
                tickFormatter={(value) =>
                  value >= 1000 ? `${(value / 1000).toFixed(1)}K` : value
                }
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(0 0% 14.5%)",
                  border: "1px solid hsl(0 0% 20%)",
                  borderRadius: "8px",
                  color: "hsl(0 0% 98.5%)",
                }}
                labelFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  });
                }}
                formatter={(value) => [
                  Number(value).toLocaleString(),
                  "Followers",
                ]}
              />
              <Line
                type="monotone"
                dataKey="followers"
                stroke="hsl(150 60% 50%)"
                strokeWidth={2}
                dot={{ fill: "hsl(150 60% 50%)", strokeWidth: 0, r: 3 }}
                activeDot={{ r: 5, fill: "hsl(150 60% 50%)" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
