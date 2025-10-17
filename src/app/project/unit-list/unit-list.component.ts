import { Component, computed, inject, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../../shared/services/project.service';
import { Unit } from '../../shared/models/unit';
import { MiniListComponent } from '../mini-list/mini-list.component';


@Component({
  selector: 'app-unit-list',
  standalone: true,
  imports: [CommonModule, FormsModule, MiniListComponent,],
  templateUrl: './unit-list.component.html',
  styleUrls: ['./unit-list.component.css']
})
export class UnitListComponent {
  private projectService = inject(ProjectService);
  @Input({ required: true }) projectId!: string;
  @Input() forceId?: string;

  newUnitName = signal('');
  units = computed(() => {
    const project = this.projectService.projects().find(p => p.id === this.projectId);
    if (!project) return [];
    if (this.forceId) {
      const force = project.forces.find(f => f.id === this.forceId);
      return force ? force.units : [];
    }
    return project.forces.flatMap(f => f.units); // aggregate across all forces
  });

  addUnit() {
    const firstForce = this.projectService.projects().find(p => p.id === this.projectId)?.forces[0];
    if (!firstForce) return;
    const name = this.newUnitName().trim();
    if (!name) return;

    this.projectService.addUnit(this.projectId, firstForce.id, {
      id: crypto.randomUUID(),
      name,
      minis: [],
    });

    this.newUnitName.set('');
  }

  removeUnit(unitId: string) {
    const project = this.projectService.projects().find(p => p.id === this.projectId);
    if (!project) return;
    for (const f of project.forces) {
      const unit = f.units.find(u => u.id === unitId);
      if (unit) {
        this.projectService.removeUnit(this.projectId, f.id, unitId);
        return;
      }
    }
  }
}
