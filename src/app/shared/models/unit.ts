import type { Mini } from './mini.ts'

export interface Unit {
  id: string;
  name: string;
  description?: string;
  minis: Mini[];
}
