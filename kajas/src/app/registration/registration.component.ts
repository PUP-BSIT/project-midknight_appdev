import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ModalService } from '../../services/modal.service';
import { UserService } from '../../services/user.service';
import { fromEvent, Subscription } from 'rxjs';
import axios, { AxiosResponse, AxiosError } from 'axios';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit, OnDestroy {
  registrationForm: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;
  existingUsernames: string[] = [];
  showModal = false;
  modalMessage = '';
  showLoader = false;
  resizeSubscription: Subscription;

  constructor(
    private fb: FormBuilder,
    private renderer: Renderer2,
    private modalService: ModalService,
    private userService: UserService
  ) {
    this.registrationForm = this.fb.group({
      username: ['', {
        validators: [
          Validators.required,
          this.usernameValidator.bind(this)
        ]
      }],
      email: ['', {
        validators: [
          Validators.required,
          Validators.email,
          this.gmailValidator.bind(this)
        ]
      }],
      password: ['', {
        validators: [
          Validators.required,
          this.passwordValidator.bind(this)
        ]
      }],
      confirmPassword: ['', {
        validators: [
          Validators.required,
          this.confirmPasswordValidator.bind(this)
        ]
      }],
      firstName: ['', {
        validators: [
          Validators.required
        ]
      }],
      middleName: [''],
      lastName: ['', {
        validators: [
          Validators.required
        ]
      }],
      terms: [false, {
        validators: [
          Validators.requiredTrue
        ]
      }],
    });

    this.registrationForm.get('password')?.valueChanges.subscribe(() => {
      this.registrationForm.get('confirmPassword')?.updateValueAndValidity();
    });
  }

  ngOnInit(): void {
    this.setInitialStyles();
    this.resizeSubscription = fromEvent(window, 'resize').subscribe(() => this.applyBackground());
    this.loadUsernames();
  }

  ngOnDestroy(): void {
    this.revertStyles();
    this.resizeSubscription.unsubscribe();
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
  
    this.applyBackground();
  }
  
  private revertStyles(): void {
    const stylesToRemove = ['height', 'overflow', 'display', 'justify-content', 'align-items', 'background'];
  
    stylesToRemove.forEach(style => {
      this.renderer.removeStyle(document.body, style);
      this.renderer.removeStyle(document.documentElement, style);
    });
  }  

  private applyBackground(): void {
    const backgroundUrl = window.innerWidth <= 425 ? '../../assets/signup_mbg.png' : '../../assets/signup_bg.png';
    this.renderer.setStyle(document.body, 'background', `url("${backgroundUrl}") center/cover no-repeat`);
  }

  private loadUsernames(): void {
    this.userService.getUsernames().subscribe({
      next: (usernames: string[]) => {
        this.existingUsernames = usernames;
      },
      error: (error: any) => {
        console.error('Error fetching usernames:', error);
      }
    });    
  }

  private usernameValidator(control: AbstractControl): ValidationErrors | null {
    if (this.existingUsernames.includes(control.value)) {
      return { usernameTaken: true };
    }
    return null;
  }

  private gmailValidator(control: AbstractControl): ValidationErrors | null {
    if (control.value && !control.value.endsWith('@gmail.com')) {
      return { notGmail: true };
    }
    return null;
  }

  private passwordValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.value;
    const errors: ValidationErrors = {};

    if (!/[A-Z]/.test(password)) {
      errors.noUpperCase = true;
    }
    if (!/[a-z]/.test(password)) {
      errors.noLowerCase = true;
    }
    if (!/\d/.test(password)) {
      errors.noNumber = true;
    }
    if (!/[!@#$%^&*]/.test(password)) {
      errors.noSpecialChar = true;
    }
    if (password.length < 8) {
      errors.tooShort = true;
    }

    return Object.keys(errors).length ? errors : null;
  }

  private confirmPasswordValidator(control: AbstractControl): ValidationErrors | null {
    if (this.registrationForm && control.value !== this.registrationForm.get('password')?.value) {
      return { mismatch: true };
    }
    return null;
  }

  onSubmit(): void {
    const url = 'https://kajas-backend.onrender.com';
    if (this.registrationForm.valid) {
      this.modalMessage = 'Loading...';
      this.showLoader = true;

      axios.post(`${url}/api/signup`, this.registrationForm.value)
        .then((response: AxiosResponse) => {
          if (response.status === 201) {
            this.modalMessage = 'Registering User...';
            return axios.post(`${url}/send/email`, { email: this.registrationForm.value.email });
          }
        })
        .then((response: AxiosResponse) => {
          if (response && response.status === 200) {
            this.modalMessage = 'User registered successfully. Please see the verification email sent.';
            this.showModal = true;
          }
        })
        .catch((error: AxiosError) => {
          console.error('Error during registration:', error);
          this.modalMessage = 'An error occurred. Please try again later.';
        })
        .finally(() => {
          this.showLoader = false;
          this.showModal = true;
        });
    } else {
      this.modalMessage = 'Please fill out the form accurately and completely.';
      this.showModal = true;
    }
  }

  togglePasswordVisibility(field: string): void {
    if (field === 'password') {
      this.hidePassword = !this.hidePassword;
    } else if (field === 'confirmPassword') {
      this.hideConfirmPassword = !this.hideConfirmPassword;
    }
  }

  openTermsModal(event: Event): void {
    event.preventDefault();
    this.modalService.openTermsModal();
  }

  closeModal(): void {
    this.showModal = false;
  }

  getErrorMessage(controlName: string): string {
    const control = this.registrationForm.get(controlName);
    if (control && control.errors) {
      if (control.errors.required) {
        return `${this.capitalizeFirstLetter(controlName)} is required.`;
      } else if (control.errors.email) {
        return 'Email must be a valid email address.';
      } else if (control.errors.notGmail) {
        return 'Email must be a valid Google mail address.';
      } else if (control.errors.usernameTaken) {
        return 'Username is already taken.';
      } else if (control.errors.tooShort) {
        return 'Password must be at least 8 characters long.';
      } else if (control.errors.noUpperCase) {
        return 'Password must include at least one uppercase letter.';
      } else if (control.errors.noLowerCase) {
        return 'Password must include at least one lowercase letter.';
      } else if (control.errors.noNumber) {
        return 'Password must include at least one number.';
      } else if (control.errors.noSpecialChar) {
        return 'Password must include at least one special character.';
      } else if (control.errors.mismatch) {
        return 'Passwords must match.';
      } else if (control.errors.requiredTrue) {
        return 'You must agree to the terms and conditions.';
      }
    }
    return '';
  }

  private capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1).replace(/([A-Z])/g, ' $1');
  }
}
