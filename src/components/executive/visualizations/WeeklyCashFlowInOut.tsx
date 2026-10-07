'use client';

import React from 'react';
import { Activity } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { sevenDayPerformanceTrend, DailyPerformancePoint } from '../../../data/seedData';

interface WeeklyCashFlowInOutProps {
  data?: DailyPerformancePoint[];
  className?: string;
}

export const WeeklyCashFlowInOut: React.FC<WeeklyCashFlowInOutProps> = ({
  data = sevenDayPerformanceTrend,
  className = '',
}) => {
  return (
    <div className={`rounded-xl border border-[#1F2937] bg-[#0B0F19] p-4 sm:p-5 shadow-lg flex flex-col justify-between text-white ${className}`}>
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-semibold tracking-tight text-white font-sans">
              Cash Flow — In vs Out
            </h3>
          </div>
          <span className="text-[10px] font-mono tracking-wider px-2 py-0.5 rounded border border-gray-700 text-gray-400 uppercase">
            ILLUSTRATIVE
          </span>
        </div>
        <p className="text-[11px] font-sans text-gray-400">
          Daily cash inflow and outflow (৳ thousands)
        </p>
      </div>

      {/* Line Chart */}
      <div className="mt-4 h-[190px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
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
              formatter={(val: any, name: any) => [
                `৳${val}K`,
                name === 'cashInflow' ? 'Cash Inflow' : 'Cash Outflow',
              ]}
              labelFormatter={(label) => `${label} · Flow`}
            />
            <Line
              type="monotone"
              dataKey="cashInflow"
              stroke="#10B981"
              strokeWidth={2.5}
              dot={{ fill: '#10B981', r: 4, strokeWidth: 1, stroke: '#0B0F19' }}
              activeDot={{ r: 6 }}
              name="cashInflow"
            />
            <Line
              type="monotone"
              dataKey="cashOutflow"
              stroke="#EF4444"
              strokeWidth={2.5}
              dot={{ fill: '#EF4444', r: 4, strokeWidth: 1, stroke: '#0B0F19' }}
              activeDot={{ r: 6 }}
              name="cashOutflow"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
