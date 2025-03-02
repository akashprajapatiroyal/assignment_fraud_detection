import { Component } from '@angular/core';
import { Route, RouterOutlet } from '@angular/router';
import { HomeComponent } from "./components/home/home.component";
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { DetectComponent } from "./components/detect/detect.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    HomeComponent,
    MatToolbarModule,
    NgbNavModule,
    DetectComponent
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'plagiarism-frontend';
  options: FormGroup;
  active = 1;
  constructor(fb: FormBuilder, private router: Router) {
    this.options = fb.group({
      bottom: 0,
      fixed: false,
      top: 0
    });
  }
  navigateTo(route: string) {
    this.router.navigateByUrl(route);
  }

}
