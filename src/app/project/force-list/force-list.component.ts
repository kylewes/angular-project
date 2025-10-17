import { Component, computed, inject, Input, signal } from '@angular/core';
import { ProjectService } from '../../shared/services/project.service';
import { Force } from '../../shared/models/force';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UnitListComponent } from '../unit-list/unit-list.component';

@Component({
  selector: 'app-force-list',
  standalone: true,
  imports: [FormsModule, CommonModule, UnitListComponent],
  templateUrl: './force-list.component.html',
  styleUrls: ['./force-list.component.css']
})
export class ForceListComponent {
  private projectService = inject(ProjectService);
  @Input({ required: true }) projectId!: string;

  newForceName = signal('');
  forces = computed(() => {
    const project = this.projectService.projects().find(p => p.id === this.projectId);
    return project ? project.forces : [];
  });

  addForce() {
    const name = this.newForceName().trim();
    if (!name) return;

    this.projectService.addForce(this.projectId, {
      id: crypto.randomUUID(),
      name,
      faction: '',
      units: [],
    });

    this.newForceName.set('');
  }

  removeForce(forceId: string) {
    this.projectService.removeForce(this.projectId, forceId);
  }

  trackById(_: number, item: Force) {
    return item.id;
  }
}
