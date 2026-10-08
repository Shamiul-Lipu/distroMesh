'use client';

import React from 'react';
import { BarChart3 } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { sevenDayPerformanceTrend, DailyPerformancePoint } from '../../../data/seedData';

interface WeeklyCollectionVsTargetProps {
  data?: DailyPerformancePoint[];
  className?: string;
}

export const WeeklyCollectionVsTarget: React.FC<WeeklyCollectionVsTargetProps> = ({
  data = sevenDayPerformanceTrend,
  className = '',
}) => {
  return (
    <div className={`rounded-xl border border-[#1F2937] bg-[#0B0F19] p-4 sm:p-5 shadow-lg flex flex-col justify-between text-white ${className}`}>
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-semibold tracking-tight text-white font-sans">
              Collection vs Target — 7 Day
            </h3>
          </div>
          <span className="text-[10px] font-mono tracking-wider px-2 py-0.5 rounded border border-gray-700 text-gray-400 uppercase">
            ILLUSTRATIVE
          </span>
        </div>
        <p className="text-[11px] font-sans text-gray-400">
          Daily collection performance (৳ thousands)
        </p>
      </div>

      {/* Bar Chart */}
      <div className="mt-4 h-[190px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            barGap={2}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1F2937"
              vertical={false}
            />
            <XAxis
              dataKey="day"
              stroke="#4B5563"
              tick={{ fill: '#9CA3AF', fontSize: 10, fontFamily: 'monospace' }}
              tickLine={false}
              axisLine={{ stroke: '#374151' }}
            />
            <YAxis
              stroke="#4B5563"
              domain={[0, 600]}
              ticks={[0, 150, 300, 450, 600]}
              tick={{ fill: '#9CA3AF', fontSize: 10, fontFamily: 'monospace' }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#111827',
                borderColor: '#374151',
                borderRadius: '8px',
                fontSize: '11px',
                fontFamily: 'monospace',
                color: '#F9FAFB',
              }}
              formatter={(val: unknown, name: unknown) => [
                `৳${String(val ?? '')}K`,
                name === 'collectionTarget' ? 'Target' : 'Collected',
              ]}
              labelFormatter={(label) => `${label} · Collection`}
            />
            <Bar
              dataKey="collectionTarget"
              fill="#2A3447"
              radius={[3, 3, 0, 0]}
              name="collectionTarget"
              barSize={11}
            />
            <Bar
              dataKey="collectionActual"
              fill="#3B82F6"
              radius={[3, 3, 0, 0]}
              name="collectionActual"
              barSize={11}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
