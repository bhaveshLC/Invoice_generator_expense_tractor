import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  imports: [],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css'
})
export class PaginationComponent {
  @Input() page: number[] = [];
  @Input() currentPage = 1
  @Output() pageChanged = new EventEmitter<any>();
  onUpdatePage(i: number) {
    this.currentPage = i
    this.pageChanged.emit(this.currentPage)
  }
}
