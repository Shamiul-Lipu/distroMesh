'use client';

import React from 'react';
import { useExecutive } from '@/context/ExecutiveContext';
import { Info, CheckCircle2 } from 'lucide-react';

export const ToastNotification: React.FC = () => {
  const { state } = useExecutive();

  if (!state.toastMessage) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 bg-[#1F2937] border-2 border-blue-500 text-white font-mono text-xs px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-slide-up">
      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
      <div>
        <div className="font-bold text-blue-400 text-[10px] uppercase">EXECUTIVE CONTROL SYSTEM</div>
        <div className="text-gray-200 mt-0.5">{state.toastMessage}</div>
      </div>
    </div>
  );
};
