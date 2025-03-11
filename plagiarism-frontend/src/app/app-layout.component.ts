import { Component } from '@angular/core';
import { AppComponent } from "./app.component";

@Component({
  selector: 'app-layout',
  template: `
    <app-root></app-root> <!-- Main App Component -->
  `,
  imports: [AppComponent]
})
export class AppLayoutComponent {}
