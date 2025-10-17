import { Component, inject, signal, computed, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../../shared/services/project.service';


@Component({
  selector: 'app-mini-list',
  standalone: true,
  imports: [CommonModule, FormsModule,],
  templateUrl: './mini-list.component.html',
  styleUrls: ['./mini-list.component.css'],
})
export class MiniListComponent {
  private projectService = inject(ProjectService);

  @Input({ required: true }) projectId!: string;
  @Input() forceId?: string;
  @Input() unitId?: string;

  newMiniName = signal('');
  newPaintScheme = signal('');

  private getCurrentForceAndUnit(): { forceId: string; unitId: string } | null {
    const project = this.projectService.projects().find(p => p.id === this.projectId);
    if (!project) return null;

    const force = this.forceId
      ? project.forces.find(f => f.id === this.forceId)
      : project.forces[0];
    if (!force) return null;

    const unit = this.unitId
      ? force.units.find(u => u.id === this.unitId)
      : force.units[0];
    if (!unit) return null;

    return { forceId: force.id, unitId: unit.id };
  }

  minis = computed(() => {
    const ids = this.getCurrentForceAndUnit();
    if (!ids) return [];

    const project = this.projectService.projects().find(p => p.id === this.projectId)!;
    const force = project.forces.find(f => f.id === ids.forceId)!;
    const unit = force.units.find(u => u.id === ids.unitId)!;
    return unit.minis;
  });

  addMini() {
    const ids = this.getCurrentForceAndUnit();
    if (!ids) return;

    const name = this.newMiniName().trim();
    if (!name) return;

    this.projectService.addMini(this.projectId, ids.forceId, ids.unitId, {
      id: crypto.randomUUID(),
      name,
      paintScheme: this.newPaintScheme(),
      completed: false,
    });

    this.newMiniName.set('');
    this.newPaintScheme.set('');
  }

  removeMini(miniId: string) {
    const ids = this.getCurrentForceAndUnit();
    if (!ids) return;
    this.projectService.removeMini(this.projectId, ids.forceId, ids.unitId, miniId);
  }

  toggleCompleted(miniId: string) {
    const ids = this.getCurrentForceAndUnit();
    if (!ids) return;

    const mini = this.minis().find(m => m.id === miniId);
    if (!mini) return;

    mini.completed = !mini.completed;
    this.projectService.updateMini(this.projectId, ids.forceId, ids.unitId, mini);
  }

  trackById(_: number, item: any) {
    return item.id;
  }
}
