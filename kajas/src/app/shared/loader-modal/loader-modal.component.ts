import { Component, EventEmitter, Input, Output } from '@angular/core';


@Component({
  selector: 'app-loader-modal',
  templateUrl: './loader-modal.component.html',
  styleUrls: ['./loader-modal.component.css']
})
export class LoaderModalComponent {
  @Input() message: string = '';
  @Output() closeModal = new EventEmitter<void>();

}
