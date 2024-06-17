import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirm-cancel-modal',
  templateUrl: './confirm-cancel-modal.component.html',
  styleUrls: ['./confirm-cancel-modal.component.css']
})
export class ConfirmCancelModalComponent {
  @Input() message: string = '';
  @Output() confirmAction = new EventEmitter<void>();
  @Output() cancelAction = new EventEmitter<void>();
  @Output() closeModal = new EventEmitter<void>();

  confirm(): void {
    this.confirmAction.emit();
  }

  cancel(): void {
    this.cancelAction.emit();
  }

  close() {
    this.closeModal.emit();
  }
}
