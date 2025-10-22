import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ProjectFormComponent } from './pages/project-form/project-form.component';

export const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'add-project', component: ProjectFormComponent },
  { path: 'edit-project/:id', component: ProjectFormComponent },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];
