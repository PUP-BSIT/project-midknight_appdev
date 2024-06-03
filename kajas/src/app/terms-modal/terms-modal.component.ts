import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-terms-modal',
  templateUrl: './terms-modal.component.html',
  styleUrls: ['./terms-modal.component.css']
})
export class TermsModalComponent implements OnInit {
  showModal$: Observable<boolean>;

  constructor(private modalService: ModalService) {
    this.showModal$ = this.modalService.getTermsModalState().asObservable();
  }

  ngOnInit(): void {}

  closeModal(): void {
    this.modalService.closeTermsModal();
  }

  openPrivacyModal(event: Event): void {
    event.preventDefault();
    this.modalService.closeTermsModal();
    this.modalService.openPrivacyModal();
  }
}
