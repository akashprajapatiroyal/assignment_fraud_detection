import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-p-policy',
  imports: [
    MatCardModule,
    MatListModule,
    MatDividerModule,
    MatButtonModule,
    RouterLink
  ],
  templateUrl: './p-policy.component.html',
  styleUrl: './p-policy.component.scss'
})
export class PPolicyComponent {

}
