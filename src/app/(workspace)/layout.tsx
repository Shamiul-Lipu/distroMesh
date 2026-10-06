import type { ReactNode } from 'react';
import { ExecutiveProvider } from '../../context/ExecutiveContext';
import { ExecutiveShell } from '../../components/executive/ExecutiveShell';

export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  return (
    <ExecutiveProvider>
      <ExecutiveShell />
      {children}
    </ExecutiveProvider>
  );
}
