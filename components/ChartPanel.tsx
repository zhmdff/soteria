"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from "recharts";
import TimeRangeSelector, { TimeRange } from "./TimeRangeSelector";

export interface ChartDataPoint {
  [key: string]: string | number | undefined | null;
}

interface ChartPanelProps {
  type: "line" | "area" | "bar";
  data: ChartDataPoint[];
  xKey: string;
  yKey: string;
  predictKey?: string;
  color?: string;
  predictColor?: string;
  height?: number | string;
  activeRange?: TimeRange;
  onRangeChange?: (range: TimeRange) => void;
  availableMin?: string;
  availableMax?: string;
  customRanges?: { label: string; value: TimeRange }[];
}

export default function ChartPanel({
  type,
  data,
  xKey,
  yKey,
  predictKey,
  color = "#00b196",
  predictColor = "#FF6B6B",
  height = 300,
  activeRange,
  onRangeChange,
  availableMin,
  availableMax,
  customRanges,
}: ChartPanelProps) {
  const renderChart = () => {
    switch (type) {
      case "area":
        return (
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorY" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis
              dataKey={xKey}
              stroke="#4A6580"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#4A6580"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0E1620",
                border: `1px solid ${color}`,
                borderRadius: "8px",
                color: "#F0F4F8",
              }}
            />
            <Area
              type="monotone"
              dataKey={yKey}
              stroke={color}
              fillOpacity={1}
              fill="url(#colorY)"
            />
            {predictKey && (
              <Area
                type="monotone"
                dataKey={predictKey}
                stroke={predictColor}
                strokeDasharray="5 5"
                fill="transparent"
              />
            )}
          </AreaChart>
        );
      case "bar":
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis
              dataKey={xKey}
              stroke="#4A6580"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#4A6580"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0E1620",
                border: `1px solid ${color}`,
                borderRadius: "8px",
                color: "#F0F4F8",
              }}
            />
            <Bar dataKey={yKey} fill={color} radius={[4, 4, 0, 0]} />
          </BarChart>
        );
      default:
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis
              dataKey={xKey}
              stroke="#4A6580"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#4A6580"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0E1620",
                border: `1px solid ${color}`,
                borderRadius: "8px",
                color: "#F0F4F8",
              }}
            />
            <Line
              type="monotone"
              dataKey={yKey}
              stroke={color}
              strokeWidth={2}
              dot={{ r: 4, fill: "#ffffff", stroke: color, strokeWidth: 2 }}
              activeDot={{ r: 6 }}
            />
            {predictKey && (
              <Line
                type="monotone"
                dataKey={predictKey}
                stroke={predictColor}
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                activeDot={{ r: 4 }}
              />
            )}
          </LineChart>
        );
    }
  };

  return (
    <div className="relative group">
      {data.length > 0 && activeRange && onRangeChange && (
        <div className="absolute top-0 right-0 z-10 transition-opacity">
          <TimeRangeSelector
            activeRange={activeRange}
            onChange={onRangeChange}
            availableMin={availableMin}
            availableMax={availableMax}
            customRanges={customRanges}
          />
        </div>
      )}
      <div style={{ width: "100%", height }} className={data.length > 0 && activeRange ? "pt-12" : ""}>
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
