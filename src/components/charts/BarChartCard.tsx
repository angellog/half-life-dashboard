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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

interface BarChartCardProps {
  title: string;
  description?: string;
  data: { type: string; impressions: number; engagement: number }[];
}

export function BarChartCard({ title, description, data }: BarChartCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 20%)" />
              <XAxis
                dataKey="type"
                tick={{ fill: "hsl(0 0% 63.9%)", fontSize: 12 }}
                axisLine={{ stroke: "hsl(0 0% 20%)" }}
              />
              <YAxis
                tick={{ fill: "hsl(0 0% 63.9%)", fontSize: 12 }}
                axisLine={{ stroke: "hsl(0 0% 20%)" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(0 0% 14.5%)",
                  border: "1px solid hsl(0 0% 20%)",
                  borderRadius: "8px",
                  color: "hsl(0 0% 98.5%)",
                }}
              />
              <Bar
                dataKey="impressions"
                fill="hsl(215 70% 60%)"
                radius={[4, 4, 0, 0]}
                name="Impressions"
              />
              <Bar
                dataKey="engagement"
                fill="hsl(280 60% 60%)"
                radius={[4, 4, 0, 0]}
                name="Engagement %"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
