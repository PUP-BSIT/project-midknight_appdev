import { Component } from '@angular/core';

@Component({
  selector: 'app-change-email',
  templateUrl: './change-email.component.html',
  styleUrl: './change-email.component.css'
})
export class ChangeEmailComponent {
  hidePassword = true;

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }
}
