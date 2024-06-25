import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalService } from '../../../services/modal.service';
import { HttpClient } from '@angular/common/http';
import { SessionStorageService } from 'angular-web-storage';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {
  @Output() showModalEvent = new EventEmitter<string>();

  changePasswordForm: FormGroup;
  hideCurrentPassword = true;
  hideNewPassword = true;
  hideConfirmPassword = true;
  modalMessage = '';
  showLoader = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private modalService: ModalService,
    private http: HttpClient,
    private sessionStorage: SessionStorageService
  ) {
    this.changePasswordForm = this.fb.group({
      currentPassword: ['', {
        validators: [
          Validators.required]
      }],
      newPassword: ['', {
        validators: [
          Validators.required,
          this.passwordValidator,
        ] }],
      confirmPassword: ['', {
        validators: [
          Validators.required, 
          this.confirmPasswordValidator.bind(this)
        ] }]
    });

    this.changePasswordForm.get('newPassword')?.valueChanges.subscribe(() => {
      this.changePasswordForm.get('confirmPassword')?.updateValueAndValidity();
    });
  }

  togglePasswordVisibility(field: string): void {
    if (field === 'current') {
      this.hideCurrentPassword = !this.hideCurrentPassword;
    } else if (field === 'new') {
      this.hideNewPassword = !this.hideNewPassword;
    } else if (field === 'confirm') {
      this.hideConfirmPassword = !this.hideConfirmPassword;
    }
  }

  private passwordValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.value;
    const errors: ValidationErrors = {};
    if (!/[A-Z]/.test(password)) errors.noUpperCase = true;
    if (!/[a-z]/.test(password)) errors.noLowerCase = true;
    if (!/[0-9]/.test(password)) errors.noNumber = true;
    if (!/[!@#$%^&*]/.test(password)) errors.noSpecialChar = true;
    if (password.length < 8) errors.tooShort = true;
    return Object.keys(errors).length ? errors : null;
  }

  private confirmPasswordValidator(control: AbstractControl): ValidationErrors | null {
    if (this.changePasswordForm && control.value !== this.changePasswordForm.get('newPassword')?.value) {
      return { mismatch: true };
    }
    return null;
  }

  onSubmit() {
    if (this.changePasswordForm.invalid) {
      this.changePasswordForm.markAllAsTouched();
      this.showModalEvent.emit('Please fill out the form accurately and completely.');
      return;
    }

    this.modalMessage = 'Changing Password...';
    this.showLoader = true;
  
    const email = this.sessionStorage.get('email');
    const formValue = this.changePasswordForm.value;
  
    this.http.post('http://localhost:4000/api/change-password', { ...formValue, email }).pipe(
      delay(1000)
    ).subscribe(
      (response: any) => {
        this.showLoader = false;
        this.showModalEvent.emit('Password changed successfully! Please log in again with your new password.');
      },
      (error: any) => {
        this.showLoader = false;
        if (error.status === 401 && error.error.message === 'Incorrect current password') {
          this.showModalEvent.emit('Invalid current password. Please try again.');
        } else if (error.status === 400 && error.error.message === 'New password cannot be the same as the old password') {
          this.showModalEvent.emit('New password cannot be the same as the old password.');
        } else {
          this.showModalEvent.emit('Error changing password. Please try again.');
        }
      }
    );
  }

  getErrorMessage(controlName: string): string {
    const control = this.changePasswordForm.get(controlName);
    if (control && control.errors) {
      if (control.errors.required) return `${this.capitalizeFirstLetter(controlName)} is required.`;
      if (control.errors.tooShort) return 'Password must be at least 8 characters long.';
      if (control.errors.noUpperCase) return 'Password must include at least one uppercase letter.';
      if (control.errors.noLowerCase) return 'Password must include at least one lowercase letter.';
      if (control.errors.noNumber) return 'Password must include at least one number.';
      if (control.errors.noSpecialChar) return 'Password must include at least one special character.';
      if (control.errors.mismatch) return 'Passwords must match.';
    }
    return '';
  }

  private capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1).replace(/([A-Z])/g, ' $1');
  }
}
