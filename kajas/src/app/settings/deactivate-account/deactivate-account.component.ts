import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { ModalService } from '../../../services/modal.service';
import { SessionStorageService } from 'angular-web-storage';

@Component({
  selector: 'app-deactivate-account',
  templateUrl: './deactivate-account.component.html',
  styleUrls: ['./deactivate-account.component.css']
})
export class DeactivateAccountComponent {
  @Output() showModalEvent = new EventEmitter<string>();

  deactivateForm: FormGroup;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private modalService: ModalService,
    private userService: UserService,
    private sessionStorage: SessionStorageService
  ) {
    this.deactivateForm = this.fb.group({
      password: ['', [Validators.required]],
    });
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  onSubmit() {
    if (this.deactivateForm.invalid) {
      this.deactivateForm.markAllAsTouched();
      this.showModalEvent.emit('Please fill out the form accurately and completely.');
      return;
    }

    const password = this.deactivateForm.get('password')?.value;
    const userId = this.sessionStorage.get('id');

    this.userService.deactivateAccount(userId, password).subscribe(
      response => {
        console.log('Account deactivated successfully!', response);
        this.router.navigate(['/']); 
      },
      error => {
        console.error('Error deactivating account:', error);
        this.showModalEvent.emit('Error deactivating account: ' + error.error.message);
      }
    );
  }

  getErrorMessage(controlName: string): string {
    const control = this.deactivateForm.get(controlName);
    if (control && control.errors) {
      if (control.errors.required) {
        return `${this.capitalizeFirstLetter(controlName)} is required.`;
      }
    }
    return '';
  }

  private capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1).replace(/([A-Z])/g, ' $1');
  }
}
