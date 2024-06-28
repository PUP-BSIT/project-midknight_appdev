import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ModalService } from '../../../services/modal.service';

@Component({
  selector: 'app-terms-and-conditions',
  templateUrl: './terms-and-conditions.component.html',
  styleUrls: ['./terms-and-conditions.component.css']
})
export class TermsAndConditionsComponent implements OnInit {
  showModal$: Observable<boolean>;

  constructor(private modalService: ModalService) {
    this.showModal$ = this.modalService.getTermsModalState().asObservable();
  }

  ngOnInit(): void {}

  openPrivacyModal(event: Event): void {
    event.preventDefault();
    this.modalService.closeTermsModal();
    this.modalService.openPrivacyModal();
  }
}
