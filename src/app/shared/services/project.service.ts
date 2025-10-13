import { computed, effect, Injectable, signal } from '@angular/core';
import { Project } from '../models/project';
import { Force } from '../models/force';
import { Unit } from '../models/unit';
import { Mini } from '../models/mini';


@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private _projects = signal<Project[]>([]);

  readonly projects = computed(() => this._projects());

  // Added expandedProjects so multiple projects can be visible at once. //
  expandedProjectIds = signal<string[]>([]);

  toggleProjectExpanded(projectId: string) {
    this.expandedProjectIds.update(ids => ids.includes(projectId)
    ? ids.filter(id => id !== projectId)
    : [...ids, projectId]);
  }

  isProjectExpanded(projectId: string): boolean {
    return this.expandedProjectIds().includes(projectId);
  }

  constructor() {
    const savedProjects = localStorage.getItem('projects');
    if (savedProjects) this._projects.set(JSON.parse(savedProjects));

    const savedExpanded = localStorage.getItem('expandedProjects');
    if (savedExpanded) this.expandedProjectIds.set(JSON.parse(savedExpanded));

    effect(() => {
    localStorage.setItem('projects', JSON.stringify(this._projects()));
    localStorage.setItem('expandedProjects', JSON.stringify(this.expandedProjectIds()));
  });
  }

  addProject(project: Project) {
    this._projects.update(projects => [...projects, project]);
  }

  removeProject(projectId: string) {
    this._projects.update(projects => projects.filter(p => p.id !== projectId))
  }

  addForce(projectId: string, force: Force) {
    this._projects.update(projects => projects.map(p => p.id === projectId
          ? { ...p, forces: [...p.forces, force] }
          : p ));
  }

  removeForce(projectId: string, forceId: string) {
    this._projects.update(projects => projects.map(p => p.id === projectId
      ? {...p, forces: p.forces.filter(f => f.id !== forceId)} :p ));
  }

  addUnit(projectId: string, forceId: string, unit: Unit) {
    this._projects.update(projects => projects.map(p => p.id === projectId
      ? {...p, forces: p.forces.map(f => f.id === forceId
        ? {...f, units: [...f.units, unit]} : f )
        } : p));
  }

  removeUnit(projectId: string, forceId: string, unitId: string) {
    this._projects.update(projects =>
      projects.map(p =>
        p.id === projectId
          ? {...p, forces: p.forces.map(f => f.id === forceId
            ? { ...f, units: f.units.filter(u => u.id !== unitId) } : f )
            }: p));
  }

  addMini(projectId: string, forceId: string, unitId: string, mini: Mini) {
    this._projects.update(projects =>
      projects.map(p =>
        p.id === projectId
          ? {...p, forces: p.forces.map(f => f.id === forceId
            ? {...f, units: f.units.map(u => u.id === unitId
              ? { ...u, minis: [...u.minis, mini] } : u)
              } : f)
            } : p));
  }

  removeMini(projectId: string, forceId: string, unitId: string, miniId: string) {
    this._projects.update(projects =>
      projects.map(p =>
        p.id === projectId
          ? { ...p, forces: p.forces.map(f => f.id === forceId
            ? {...f, units: f.units.map(u => u.id === unitId
              ? { ...u, minis: u.minis.filter(m => m.id !== miniId) } : u)
              } : f )
            } : p ));
  }

  // Replace an existing mini (by id) with the provided mini object
  updateMini(projectId: string, forceId: string, unitId: string, mini: Mini) {
    this._projects.update(projects =>
      projects.map(p =>
        p.id === projectId
          ? {
              ...p,
              forces: p.forces.map(f =>
                f.id === forceId
                  ? {
                      ...f,
                      units: f.units.map(u =>
                        u.id === unitId
                          ? { ...u, minis: u.minis.map(m => (m.id === mini.id ? mini : m)) }
                          : u
                      ),
                    }
                  : f
              ),
            }
          : p
      )
    );
  }

}
