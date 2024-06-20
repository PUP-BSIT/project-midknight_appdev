import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalService } from '../../../services/modal.service'; 

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

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private modalService: ModalService 
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
      this.changeEmailForm.markAllAsTouched();
      this.showModalEvent.emit('Please fill out the form accurately and completely.');
      return;
    }
    
    console.log('Form submitted successfully!');
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
