import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatSlideToggleModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  constructor(fb: FormBuilder, private router: Router) {}
  navigateTo(route: string) {
    this.router.navigateByUrl(route);
  }
}
