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
  }  
}
