"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const data = [
  { name: "Aromatherapy", value: 40, color: "#2D6A4F" },
  { name: "Thai Massage", value: 25, color: "#52B788" },
  { name: "Hot Stone", value: 20, color: "#95D5B2" },
  { name: "Herbal Compress", value: 10, color: "#D4A843" },
  { name: "อื่นๆ", value: 5, color: "#CBD5E1" },
];

export function CategoryDonut() {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-sm font-bold text-slate-800">หมวดหมู่นิยม</h3>
        <p className="mt-0.5 text-xs text-slate-400">Popular Categories</p>
      </div>

      {/* Chart + Legend */}
      <div className="flex flex-col items-center gap-4 sm:flex-row">
        {/* Donut */}
        <div className="relative h-[180px] w-[180px] shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {data.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                  fontSize: "12px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                }}
                formatter={(value) => [`${value}%`, "สัดส่วน"]}
              />
            </PieChart>
          </ResponsiveContainer>
          {/* Center label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold text-slate-800">฿250,000</span>
            <span className="text-[10px] text-slate-400">รวมทั้งหมด</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-2.5">
          {data.map((item) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ background: item.color }}
                />
                <span className="text-xs font-medium text-slate-600">
                  {item.name}
                </span>
              </div>
              <span className="text-xs font-bold text-slate-800">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
