import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import axios, { AxiosResponse, AxiosError } from 'axios';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  resetPasswordForm: FormGroup;
  token = '';
  hidePassword = true;
  hideConfirmPassword = true;
  showModal = false;
  modalMessage = '';
  showLoader = false;

  constructor(
    private renderer: Renderer2,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.resetPasswordForm = this.fb.group({
      newPassword: ['', {
        validators: [
          Validators.required,
          this.passwordValidator.bind(this)
        ]
      }],
      confirmNewPassword: ['', {
        validators: [
          Validators.required,
          this.confirmPasswordValidator.bind(this)
        ]
      }],
    });

    this.resetPasswordForm.get('newPassword')?.valueChanges.subscribe(() => {
      this.resetPasswordForm.get('confirmNewPassword')?.updateValueAndValidity();
    });
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParams['token'];
    this.setInitialStyles();
  }

  ngOnDestroy(): void {
    this.revertStyles();
  }

  private setInitialStyles(): void {
    const styles = {
      body: {
        'height': '100%',
        'overflow': 'hidden',
        'display': 'flex',
        'justify-content': 'center',
        'align-items': 'center',
        'background': 'url("../../assets/signup_bg.png") center/cover no-repeat'
      },
      html: {
        'height': '100%',
        'overflow': 'hidden'
      }
    };
  
    Object.entries(styles.body).forEach(([prop, value]) => {
      this.renderer.setStyle(document.body, prop, value);
    });
  
    Object.entries(styles.html).forEach(([prop, value]) => {
      this.renderer.setStyle(document.documentElement, prop, value);
    });
  }
  
  private revertStyles(): void {
    const stylesToRemove = ['height', 'overflow', 'display', 'justify-content', 'align-items', 'background'];
  
    stylesToRemove.forEach(style => {
      this.renderer.removeStyle(document.body, style);
      this.renderer.removeStyle(document.documentElement, style);
    });
  }  

  private passwordValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.value;
    if (!password) return null;
  
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
    const errors: ValidationErrors = {};
    if (password.length < minLength) {
      errors['tooShort'] = true;
    }
    if (!hasUpperCase) {
      errors['noUpperCase'] = true;
    }
    if (!hasLowerCase) {
      errors['noLowerCase'] = true;
    }
    if (!hasNumber) {
      errors['noNumber'] = true;
    }
    if (!hasSpecialChar) {
      errors['noSpecialChar'] = true;
    }

    return Object.keys(errors).length !== 0 ? errors : null;
  }
  
  private confirmPasswordValidator(control: AbstractControl): ValidationErrors | null {
    if (!this.resetPasswordForm) return null;
    const password = this.resetPasswordForm.get('newPassword')?.value;
    const confirmPassword = control.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  getErrorMessage(controlName: string): string {
    const control = this.resetPasswordForm.get(controlName);
    if (control?.hasError('required')) {
      const fieldName = controlName === 'newPassword' ? 'New Password' : 'Confirm New Password';
      return `${fieldName} is required.`;
    } else if (control?.hasError('passwordStrength')) {
      return 'Password must include upper, lower case, number, and special character.';
    } else if (control?.hasError('passwordMismatch')) {
      return 'Passwords do not match.';
    } else if (control?.hasError('tooShort')) {
      return 'Password must be at least 8 characters long.';
    } else if (control?.hasError('noUpperCase')) {
      return 'Password must include at least one uppercase letter.';
    } else if (control?.hasError('noLowerCase')) {
      return 'Password must include at least one lowercase letter.';
    } else if (control?.hasError('noNumber')) {
      return 'Password must include at least one number.';
    } else if (control?.hasError('noSpecialChar')) {
      return 'Password must include at least one special character.';
    }
    return '';
  }
  

  togglePasswordVisibility(field: string): void {
    if (field === 'password') {
      this.hidePassword = !this.hidePassword;
    } else if (field === 'confirmPassword') {
      this.hideConfirmPassword = !this.hideConfirmPassword;
    }
  }

  onSubmit() {
    if (this.resetPasswordForm.invalid) {
      this.modalMessage = 'Please fill out the form first.';
      this.showModal = true;
      return;
    }
  
    this.modalMessage = 'Changing Password...';
    this.showLoader = true;
  
    axios.post('https://api.kajas.site/api/reset-password', {
      token: this.token,
      newPassword: this.resetPasswordForm.get('newPassword')?.value,
      confirmNewPassword: this.resetPasswordForm.get('confirmNewPassword')?.value
    })
    .then((response: AxiosResponse) => {
      this.showLoader = false;
      this.modalMessage = 'Password has been reset successfully. You may now log in with your new password.';
    })
    .catch((error: AxiosError) => {
      console.error('Error in password reset:', error);
      this.showLoader = false;
      this.modalMessage = 'An error occurred. Please try again later.';
    })
    .finally(() => {
      this.showModal = true;
    });
  }

  closeModal() {
    this.showModal = false;
    if (this.resetPasswordForm.valid) {
      this.router.navigate(['/login']);
    }
  }
}
