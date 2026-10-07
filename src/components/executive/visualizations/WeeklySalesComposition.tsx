'use client';

import React from 'react';
import { TrendingUp } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { sevenDayPerformanceTrend, DailyPerformancePoint } from '../../../data/seedData';

interface WeeklySalesCompositionProps {
  data?: DailyPerformancePoint[];
  className?: string;
}

export const WeeklySalesComposition: React.FC<WeeklySalesCompositionProps> = ({
  data = sevenDayPerformanceTrend,
  className = '',
}) => {
  return (
    <div className={`rounded-xl border border-[#1F2937] bg-[#0B0F19] p-4 sm:p-5 shadow-lg flex flex-col justify-between text-white ${className}`}>
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-semibold tracking-tight text-white font-sans">
              Sales Composition — 7 Day Trend
            </h3>
          </div>
          <span className="text-[10px] font-mono tracking-wider px-2 py-0.5 rounded border border-gray-700 text-gray-400 uppercase">
            ILLUSTRATIVE
          </span>
        </div>
        <p className="text-[11px] font-sans text-gray-400">
          Cash vs credit by day (৳ thousands)
        </p>
      </div>

      {/* Area Chart */}
      <div className="mt-4 h-[190px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="cashGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="creditGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0} />
              </linearGradient>
            </defs>
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
              domain={[0, 360]}
              ticks={[0, 90, 180, 270, 360]}
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
                name === 'cashSales' ? 'Cash Sales' : 'Credit Sales',
              ]}
              labelFormatter={(label) => `${label} · Daily Trend`}
            />
            <Area
              type="monotone"
              dataKey="cashSales"
              stroke="#10B981"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#cashGrad)"
              name="cashSales"
            />
            <Area
              type="monotone"
              dataKey="creditSales"
              stroke="#F59E0B"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#creditGrad)"
              name="creditSales"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
