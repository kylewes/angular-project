import { Component, inject, signal } from '@angular/core';
import { ProjectService } from '../../shared/services/project.service';
import { Project } from '../../shared/models/project';
import { CommonModule} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ForceListComponent } from '../force-list/force-list.component';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [ CommonModule, FormsModule, ForceListComponent],
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent {

  private projectService = inject(ProjectService);
  projects = this.projectService.projects;

  newProjectName = signal('');
  newProjectDesc = signal('');

addProject() {
  const name = this.newProjectName().trim();
  if (!name) return;

  this.projectService.addProject({
    id: crypto.randomUUID(),
    name,
    description: this.newProjectDesc(),
    forces: [],
  });

  this.newProjectName.set('');
  this.newProjectDesc.set('');

}

removeProject(id: string) {
  this.projectService.removeProject(id);
}

trackById(_: number, item: Project) {
    return item.id;
  }

}
