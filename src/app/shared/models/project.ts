import type { Force } from './force.ts';

export interface Project {
id: string;
name: string;
description?: string;
forces: Force[];
}
