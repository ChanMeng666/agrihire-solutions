"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const COLORS = [
  "hsl(145, 60%, 40%)",
  "hsl(200, 60%, 50%)",
  "hsl(45, 80%, 50%)",
  "hsl(280, 50%, 55%)",
  "hsl(10, 70%, 55%)",
  "hsl(170, 50%, 45%)",
];

interface CategoryChartProps {
  data: { categoryName: string; count: number }[];
}

export function CategoryChart({ data }: CategoryChartProps) {
  const chartData = data.map((d) => ({
    name: d.categoryName,
    value: Number(d.count),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Bookings by Category</CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No booking data available yet.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label
              >
                {chartData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
