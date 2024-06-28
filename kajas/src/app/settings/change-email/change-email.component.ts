import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { EmailService } from '../../../services/email.service';
import { SessionStorageService } from 'angular-web-storage';

@Component({
  selector: 'app-change-email',
  templateUrl: './change-email.component.html',
  styleUrls: ['./change-email.component.css']
})
export class ChangeEmailComponent {
  @Output() showModalEvent = new EventEmitter<string>();

  changeEmailForm: FormGroup;
  submitted = false;
  errorMessage = '';
  hidePassword = true;
  modalMessage = '';
  showLoader = false;

  constructor(
    private fb: FormBuilder,
    private emailService: EmailService,
    private sessionStorage: SessionStorageService
  ) {
    this.changeEmailForm = this.fb.group({
      email: ['', {
        validators: [
          Validators.required,
          Validators.email,
          this.gmailValidator
        ]
      }],

      password: ['', {
        validators: [
          Validators.required
        ]
      }]
    });
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  private gmailValidator(control: AbstractControl): ValidationErrors | null {
    if (control.value && !control.value.endsWith('@gmail.com')) {
      return { notGmail: true };
    }
    return null;
  }

  onSubmit() {
    if (this.changeEmailForm.invalid) {
      this.modalMessage = 'Changing Email...';
      this.showLoader = true;
      this.changeEmailForm.markAllAsTouched();
      this.showModalEvent.emit('Please fill out the form accurately and completely.');
      return;
    }

    this.showLoader = true;

    const userId = this.sessionStorage.get('id');
    const emailCheck = this.sessionStorage.get('email');
    const formValue = this.changeEmailForm.value;

    if (formValue.email === emailCheck) {
      this.showLoader = false;
      this.showModalEvent.emit('New email cannot be the same as the old email');
      return;
    }

    this.emailService.changeEmail(userId, formValue.email, formValue.email, formValue.password).subscribe({
      next: (response: any) => {
        this.showLoader = false;
        this.showModalEvent.emit('Email changed successfully! Please log in again with your new email.');
      },
      error: (error: any) => {
        this.showLoader = false;
        if (error.status === 401 && error.error.message === 'Incorrect password') {
          this.showModalEvent.emit('Invalid password. Please try again.');
        } else {
          this.showModalEvent.emit('Error changing email. Please try again.');
        }
      }
    });    
  }

  getErrorMessage(controlName: string): string {
    const control = this.changeEmailForm.get(controlName);
    if (control && control.errors) {
      if (control.errors.required) {
        return `${this.capitalizeFirstLetter(controlName)} is required.`;
      } else if (control.errors.email) {
        return 'Email must be a valid email address.';
      } else if (control.errors.notGmail) {
        return 'Email must be a valid Google mail address.';
      } 
    }
    return '';
  }

  private capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1).replace(/([A-Z])/g, ' $1');
  }

}
