import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatSlideToggleModule,
    MatCardModule,
    MatButtonModule,
    MatListModule,
    MatDividerModule,
    MatIconModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  constructor(fb: FormBuilder, private router: Router) {}
  navigateTo(route: string) {
    this.router.navigateByUrl(route);
  }

  scrollTo(section: string) {
    document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
  }
}
