import { Component, inject, signal } from '@angular/core';
import { ProjectService } from '../../shared/services/project.service';
import { Project } from '../../shared/models/project';
import { CommonModule} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ForceListComponent } from '../force-list/force-list.component';
import { UnitListComponent } from '../unit-list/unit-list.component';
import { MiniListComponent } from '../mini-list/mini-list.component';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [ CommonModule, FormsModule, ForceListComponent, UnitListComponent, MiniListComponent],
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent {

  private projectService = inject(ProjectService);
  projects = this.projectService.projects;

  newProjectName = signal('');
  activeTab = signal<'forces' | 'units' | 'minis'>('forces');
  selectedProjectId = signal<string | null>(null);

  addProject() {
    const name = this.newProjectName().trim();
    if (!name) return;

    this.projectService.addProject({
      id: crypto.randomUUID(),
      name,
      description: '',
      forces: [],
    });
    this.newProjectName.set('');
  }

  removeProject(id: string) {
    this.projectService.removeProject(id);
    if (this.selectedProjectId() === id) this.selectedProjectId.set(null);
  }

  setActiveTab(tab: 'forces' | 'units' | 'minis') {
    this.activeTab.set(tab);
  }

  selectProject(id: string) {
    this.selectedProjectId.set(this.selectedProjectId() === id ? null : id);
  }

  trackById(_: number, item: Project) {
    return item.id;
  }


}
