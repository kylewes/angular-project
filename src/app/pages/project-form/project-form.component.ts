import { Component, inject, signal } from '@angular/core';
import { ProjectService } from '../../shared/services/project.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Force } from '../../shared/models/force';
import { Unit } from '../../shared/models/unit';
import { Mini } from '../../shared/models/mini';
import { Project } from '../../shared/models/project';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-project-form',
  imports: [FormsModule, CommonModule],
  templateUrl: './project-form.component.html',
  styleUrl: './project-form.component.css'
})
export class ProjectFormComponent {
  private projectService = inject(ProjectService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  projectId = this.route.snapshot.paramMap.get('id');

  // Signals for form data
  projectName = signal('');
  projectDesc = signal('');
  forces = signal<Force[]>([]);

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

  addForce() {
    const newForce: Force = { id: crypto.randomUUID(), name: '', units: [] };
    this.forces.update(f => [...f, newForce]);
  }

  removeForce(forceId: string) {
    this.forces.update(f => f.filter(force => force.id !== forceId));
  }

  addUnit(forceIndex: number) {
    const newUnit: Unit = { id: crypto.randomUUID(), name: '', minis: [] };
    this.forces.update(f => {
      const copy = [...f];
      copy[forceIndex].units.push(newUnit);
      return copy;
    });
  }

  addMini(forceIndex: number, unitIndex: number) {
    const newMini: Mini = { id: crypto.randomUUID(), name: '', completed: false };
    this.forces.update(f => {
      const copy = [...f];
      copy[forceIndex].units[unitIndex].minis.push(newMini);
      return copy;
    });
  }

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
