import { Component, inject, signal } from '@angular/core';
import { ProjectService } from '../../shared/services/project.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Force } from '../../shared/models/force';
import { Unit } from '../../shared/models/unit';
import { Mini } from '../../shared/models/mini';
import { Project } from '../../shared/models/project';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ForceModalComponent } from '../../shared/ui/force-modal/force-modal.component';
import { UnitModalComponent } from '../../shared/ui/unit-modal/unit-modal.component';
import { MiniModalComponent } from '../../shared/ui/mini-modal/mini-modal.component';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [FormsModule, CommonModule, ForceModalComponent, UnitModalComponent, MiniModalComponent],
  templateUrl: './project-form.component.html',
  styleUrl: './project-form.component.css'
})
export class ProjectFormComponent {
  private projectService = inject(ProjectService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  projectId = this.route.snapshot.paramMap.get('id');

  // --- Signals ---
  projectName = signal('');
  projectDesc = signal('');
  forces = signal<Force[]>([]);

  // --- Modal Control ---
  showForceModal = signal(false);
  showUnitModal = signal(false);
  showMiniModal = signal(false);

  // --- Context for adding Units/Minis ---
  selectedForceId: string | null = null;
  selectedUnitId: string | null = null;

  constructor() {
    if (this.projectId) {
      const project = this.projectService.projects().find(p => p.id === this.projectId);
      if (project) {
        this.projectName.set(project.name);
        this.projectDesc.set(project.description || '');
        this.forces.set(project.forces);
      }
    }
  }

  // ---------- Modal Triggers ----------
  openForceModal() {
    this.showForceModal.set(true);
  }

  openUnitModal(forceId: string) {
    this.selectedForceId = forceId;
    this.showUnitModal.set(true);
  }

  openMiniModal(forceId: string, unitId: string) {
    this.selectedForceId = forceId;
    this.selectedUnitId = unitId;
    this.showMiniModal.set(true);
  }

  // ---------- Modal Close Handlers ----------
closeForceModal() {
  this.showForceModal.set(false);
}

closeUnitModal() {
  this.showUnitModal.set(false);
}

closeMiniModal() {
  this.showMiniModal.set(false);
}

  // ---------- Modal Callbacks ----------
  onForceSaved(data: { name: string }) {
    const newForce: Force = { id: crypto.randomUUID(), name: data.name, units: [] };
    this.forces.update(f => [...f, newForce]);
    this.showForceModal.set(false);
  }

  onUnitSaved(data: { name: string }) {
    if (!this.selectedForceId) return;
    this.forces.update(forces =>
      forces.map(force =>
        force.id === this.selectedForceId
          ? { ...force, units: [...force.units, { id: crypto.randomUUID(), name: data.name, minis: [] }] }
          : force
      )
    );
    this.showUnitModal.set(false);
  }

  onMiniSaved(data: { name: string }) {
    if (!this.selectedForceId || !this.selectedUnitId) return;
    this.forces.update(forces =>
      forces.map(force =>
        force.id === this.selectedForceId
          ? {
              ...force,
              units: force.units.map(unit =>
                unit.id === this.selectedUnitId
                  ? { ...unit, minis: [...unit.minis, { id: crypto.randomUUID(), name: data.name, completed: false }] }
                  : unit
              )
            }
          : force
      )
    );
    this.showMiniModal.set(false);
  }

  // ---------- Remove Handlers ----------
  removeForce(forceId: string) {
    this.forces.update(f => f.filter(force => force.id !== forceId));
  }

  removeUnit(forceId: string, unitId: string) {
    this.forces.update(forces =>
      forces.map(force =>
        force.id === forceId
          ? { ...force, units: force.units.filter(unit => unit.id !== unitId) }
          : force
      )
    );
  }

  removeMini(forceId: string, unitId: string, miniId: string) {
    this.forces.update(forces =>
      forces.map(force =>
        force.id === forceId
          ? {
              ...force,
              units: force.units.map(unit =>
                unit.id === unitId
                  ? { ...unit, minis: unit.minis.filter(mini => mini.id !== miniId) }
                  : unit
              )
            }
          : force
      )
    );
  }

  // ---------- Save Project ----------
  saveProject() {
    const project: Project = {
      id: this.projectId || crypto.randomUUID(),
      name: this.projectName(),
      description: this.projectDesc(),
      forces: this.forces(),
    };

    if (this.projectId) {
      this.projectService.removeProject(this.projectId);
    }

    this.projectService.addProject(project);
    this.router.navigate(['/dashboard']);
  }
}
