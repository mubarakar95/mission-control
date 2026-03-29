'use client';

import { ReactNode } from 'react';
import { MissionControlLayout } from '@/components/infrastructure/mission-control-layout';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <MissionControlLayout>{children}</MissionControlLayout>;
}
