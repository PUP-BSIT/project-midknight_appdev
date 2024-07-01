import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { SessionStorageService } from 'angular-web-storage';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-deactivate-account',
  templateUrl: './deactivate-account.component.html',
  styleUrls: ['./deactivate-account.component.css']
})
export class DeactivateAccountComponent {
  @Output() showModalEvent = new EventEmitter<string>();
  @Output() openConfirmModalEvent = new EventEmitter<Function>();
  @Output() showLoaderEvent = new EventEmitter<string>();
  @Output() hideLoaderEvent = new EventEmitter<void>();

  deactivateForm: FormGroup;
  hidePassword = true;
  password: string = '';

  constructor(
    private fb: FormBuilder,
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

  onDeactivateAttempt() {
    if (this.deactivateForm.invalid) {
      this.deactivateForm.markAllAsTouched();
      this.showModalEvent.emit('Please fill out the form accurately and completely.');
      return;
    }
    this.password = this.deactivateForm.get('password')?.value;
    this.openConfirmModalEvent.emit(() => this.onConfirmDeactivation());
  }
  
  onConfirmDeactivation() {
    this.showLoaderEvent.emit('Deactivating Account...');
    const userId = this.sessionStorage.get('id');
    this.userService.deactivateAccount(userId, this.password).pipe(
      delay(1000)
    ).subscribe({
      next: (response) => {
        this.hideLoaderEvent.emit();
        this.showModalEvent.emit('Your account has been successfully deactivated. Thank you for being a part of our community.');
      },
      error: (error) => {
        this.hideLoaderEvent.emit();
        if (error.status === 400 && error.error.message === 'Incorrect password') {
          this.showModalEvent.emit('Invalid password. Please try again.');
        } else {
          this.showModalEvent.emit('Error deactivating account: ' + error.error.message);
        }
      }
    });    
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
