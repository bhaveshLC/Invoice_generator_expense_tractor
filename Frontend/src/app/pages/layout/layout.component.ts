import { Component } from '@angular/core';
import { SidebarComponent } from "../../core/shared/sidebar/sidebar.component";
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  imports: [CommonModule, RouterOutlet, SidebarComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {
  isSidebarVisible: boolean = false
  toggleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible
  }
}
