import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { DetectComponent } from './components/detect/detect.component';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' }, // Redirect to Home by default
    { path: 'home', component: HomeComponent },
    { path: 'detect', component: DetectComponent },

];
