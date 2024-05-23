import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private termsModalState = new BehaviorSubject<boolean>(false);
  private privacyModalState = new BehaviorSubject<boolean>(false);

  openTermsModal(): void {
    this.termsModalState.next(true);
  }

  closeTermsModal(): void {
    this.termsModalState.next(false);
  }

  getTermsModalState(): BehaviorSubject<boolean> {
    return this.termsModalState;
  }

  openPrivacyModal(): void {
    this.privacyModalState.next(true);
  }

  closePrivacyModal(): void {
    this.privacyModalState.next(false);
  }

  getPrivacyModalState(): BehaviorSubject<boolean> {
    return this.privacyModalState;
  }
}
