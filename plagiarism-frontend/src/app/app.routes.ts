import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { DetectComponent } from './components/detect/detect.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { AppComponent } from './app.component';
import { AuthGuard } from './auth.guard';
import { ReportComponent } from './components/report/report.component';
import { PPolicyComponent } from './components/p-policy/p-policy.component';
import { AboutComponent } from './components/about/about.component';
export const routes: Routes = [
    // { path: '', redirectTo: '/home', pathMatch: 'full' }, // Redirect to Home by default
    // { path: 'home', component: HomeComponent },
    // { path: 'detect', component: DetectComponent },
    // { path: 'login', component: LoginComponent },
    // { path: 'register', component: RegisterComponent },
    // { path: 'dashboard', component: AppComponent, canActivate: [AuthGuard] }, 
    { path: '', redirectTo: '/login', pathMatch: 'full' }, // Default to Login
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'detect', component: DetectComponent, canActivate: [AuthGuard] },
    { path: 'reports', component: ReportComponent, canActivate: [AuthGuard] },
    { path: 'privacy-policy', component: PPolicyComponent },
    { path: 'about', component: AboutComponent, canActivate: [AuthGuard] }



    // Protected Routes - Only accessible after login
    // { 
    //     path: 'app', 
    //     component: AppComponent, 
    //     canActivate: [AuthGuard],
    //     children: [
    //         { path: 'home', component: HomeComponent },
    //         { path: 'detect', component: DetectComponent },
    //         { path: '', redirectTo: 'home', pathMatch: 'full' }
    //     ]
    // }
];
