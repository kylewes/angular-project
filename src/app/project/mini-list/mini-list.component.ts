import { Component, inject, signal, computed, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../../shared/services/project.service';

@Component({
  selector: 'app-mini-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mini-list.component.html',
  styleUrls: ['./mini-list.component.css'],
})
export class MiniListComponent {
  private projectService = inject(ProjectService);

  @Input({ required: true }) projectId!: string;
  @Input({ required: true }) forceId!: string;
  @Input({ required: true }) unitId!: string;

  newMiniName = signal('');
  newPaintScheme = signal('');

  minis = computed(() => {
    const project = this.projectService.projects().find(p => p.id === this.projectId);
    const force = project?.forces.find(f => f.id === this.forceId);
    const unit = force?.units.find(u => u.id === this.unitId);
    return unit ? unit.minis : [];
  });

  addMini() {
    const name = this.newMiniName().trim();
    if (!name) return;

    this.projectService.addMini(this.projectId, this.forceId, this.unitId, {
      id: crypto.randomUUID(),
      name,
      paintScheme: this.newPaintScheme(),
      completed: false,
    });

    this.newMiniName.set('');
    this.newPaintScheme.set('');
  }

  removeMini(miniId: string) {
    this.projectService.removeMini(this.projectId, this.forceId, this.unitId, miniId);
  }

  toggleCompleted(miniId: string) {
    const minis = this.minis();
    const mini = minis.find(m => m.id === miniId);
    if (mini) {
      mini.completed = !mini.completed;
  // Replace the existing mini entry with the updated one
  this.projectService.updateMini(this.projectId, this.forceId, this.unitId, mini);
    }
  }

  trackById(_: number, item: any) {
    return item.id;
  }
}
