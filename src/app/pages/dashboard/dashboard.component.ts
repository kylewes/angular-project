import { Component, computed, inject } from '@angular/core';
import { ProjectService } from '../../shared/services/project.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [FormsModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  private projectService = inject(ProjectService);
  private router = inject(Router);

  projects = computed(() => this.projectService.projects());

  trackById(_: number, project: any) {
    return project.id;
  }

  getSummary(projectId: string) {
    return this.projectService.getSummary(projectId);
  }

  editProject(id: string) {
    this.router.navigate(['/edit', id]);
  }

  removeProject(id: string) {
    if (confirm('Delete this project?')) {
      this.projectService.removeProject(id);
    }
  }
}
