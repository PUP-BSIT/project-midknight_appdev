import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-privacy-modal',
  templateUrl: './privacy-modal.component.html',
  styleUrls: ['./privacy-modal.component.css']
})
export class PrivacyModalComponent implements OnInit {
  showModal$: Observable<boolean>;

  constructor(private modalService: ModalService) {
    this.showModal$ = this.modalService.getPrivacyModalState().asObservable();
  }

  ngOnInit(): void {}

  closeModal(): void {
    this.modalService.closePrivacyModal();
  }
}
