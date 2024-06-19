import { Component } from '@angular/core';

@Component({
  selector: 'app-deactivate-account',
  templateUrl: './deactivate-account.component.html',
  styleUrl: './deactivate-account.component.css'
})
export class DeactivateAccountComponent {
  hidePassword = true;

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

}
