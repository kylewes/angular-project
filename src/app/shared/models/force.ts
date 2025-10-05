import type { Unit } from './unit.ts';

export interface Force {
  id: string;
  name: string;
  faction?: string;
  units: Unit[];
}

