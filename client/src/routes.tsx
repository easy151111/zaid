import type { ComponentType, JSX } from 'react';

import { Home } from './pages/Home';
import { Leaderboard } from './pages/Leaderboard';
import { Frens } from './pages/Frens';

interface Route {
  path: string;
  Component: ComponentType;
  title?: string;
  icon?: JSX.Element;
}

export const routes: Route[] = [
  { path: '/', Component: Home },
  { path: '/leaderboard', Component: Leaderboard, title: 'Leaderboard' },
  { path: '/frens', Component: Frens, title: 'Frens' },
];
