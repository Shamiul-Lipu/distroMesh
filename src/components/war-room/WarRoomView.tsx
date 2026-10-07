'use client';

import React from 'react';
import { ExecutiveControlBoard } from '../executive/control-board/ExecutiveControlBoard';

export const WarRoomView: React.FC<{ businessSlug?: string }> = ({
  businessSlug = 'unilever-distribution',
}) => {
  return <ExecutiveControlBoard businessSlug={businessSlug} />;
};
