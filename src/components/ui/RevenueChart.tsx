"use client";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";

const data = [
  { month: "Jan", revenue: 30 },
  { month: "Feb", revenue: 45 },
  { month: "Mar", revenue: 50 },
  { month: "Apr", revenue: 60 },
  { month: "May", revenue: 75 },
  { month: "Jun", revenue: 90 },
];

export default function RevenueChart() {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#0A3D79" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#0A3D79" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="month" axisLine={false} tickLine={false} />
        <YAxis hide />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="#0A3D79"
          fillOpacity={1}
          fill="url(#colorRev)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
