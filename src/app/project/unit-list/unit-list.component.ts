import { Component, computed, inject, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../../shared/services/project.service';
import { Unit } from '../../shared/models/unit';

@Component({
  selector: 'app-unit-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './unit-list.component.html',
  styleUrls: ['./unit-list.component.css']
})
export class UnitListComponent {
  private projectService = inject(ProjectService);

  @Input({ required: true }) forceId!: string;
  @Input({ required: true }) projectId!: string;

  newUnitName = signal('');

  units = computed(() => {
    const project = this.projectService.projects().find(p => p.id === this.projectId);
    if (!project) return [] as Unit[];
    const force = project.forces.find(f => f.id === this.forceId);
    return force ? force.units : [];
  });

  addUnit() {
    const name = this.newUnitName().trim();
    if (!name) return;

    this.projectService.addUnit(this.projectId, this.forceId, {
      id: crypto.randomUUID(),
      name,
      minis: []
    } as Unit);

    this.newUnitName.set('');
  }

  removeUnit(unitId: string) {
    this.projectService.removeUnit(this.projectId, this.forceId, unitId);
  }

  trackById(_: number, item: Unit) {
    return item.id;
  }
}
