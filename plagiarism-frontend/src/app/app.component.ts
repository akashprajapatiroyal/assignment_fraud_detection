import { Component } from '@angular/core';
import { NavigationEnd, Route, RouterOutlet } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';


@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    MatToolbarModule,
    NgbNavModule,
    CommonModule,
    MatFormFieldModule
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  showNavbar: boolean = true;
  title = 'plagiarism-frontend';
  options: FormGroup;
  active = 1;
  constructor(fb: FormBuilder, private router: Router) {
    this.options = fb.group({
      bottom: 0,
      fixed: false,
      top: 0
    });
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.showNavbar = !(event.url === '/login' || event.url === '/register');
      }
    });
  }
  navigateTo(route: string) {
    this.router.navigateByUrl(route);
  }

  logout() {
    localStorage.removeItem('token'); // Remove token
    this.router.navigate(['/login']); // Redirect to login page
  }

}
