import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  selectedTab: string = 'change-email';
  showModal = false;
  modalMessage = '';

  constructor(
    private router: Router
  ) {}

  selectTab(tab: string) {
    this.selectedTab = tab;
  }

  showModalMessage(message: string): void {
    this.modalMessage = message;
    this.showModal = true;
  }

  close():void{
    this.router.navigateByUrl('/profile');
  }

  closeModal(): void {
    this.showModal = false;
    if (this.modalMessage === 'Password changed successfully! Please log in again with your new password.' ||
      this.modalMessage === 'Email changed successfully! Please log in again with your new email.'
    ) {
      this.router.navigateByUrl('/login');
    } else if (this.modalMessage === 'Your issue has been sent to our support team. Thank you for reaching out to us!' ) {
      this.router.navigateByUrl('/profile');
    }
  }  
}
