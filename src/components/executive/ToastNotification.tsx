'use client';

import React from 'react';
import { useExecutive } from '@/context/ExecutiveContext';
import { CheckCircle2 } from 'lucide-react';

export const ToastNotification: React.FC = () => {
  const { state } = useExecutive();

  if (!state.toastMessage) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--foreground)] font-mono text-xs px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-slide-up backdrop-blur-md">
      <CheckCircle2 className="w-5 h-5 text-[var(--success)] shrink-0" />
      <div>
        <div className="font-bold text-[var(--accent)] text-[10px] uppercase tracking-wider">EXECUTIVE CONTROL SYSTEM</div>
        <div className="text-[var(--foreground-muted)] mt-0.5">{state.toastMessage}</div>
      </div>
    </div>
  );
};
