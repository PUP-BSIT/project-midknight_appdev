import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { fromEvent, Subscription } from 'rxjs';
import axios, { AxiosResponse, AxiosError } from 'axios';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})

export class ForgotPasswordComponent implements OnInit, OnDestroy {
  forgotPasswordForm: FormGroup;
  submitted = false;
  errorMessage = '';
  showModal = false;
  modalMessage = '';
  resizeSubscription: Subscription;
  showLoader = false;

  constructor(
    private renderer: Renderer2,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', {
        validators: [
          Validators.required,
          Validators.email,
          this.gmailValidator.bind(this)
        ]
      }]
    });
  }

  ngOnInit(): void {
    this.setInitialStyles();
    this.resizeSubscription = fromEvent(window, 'resize').subscribe(() => this.applyBackground());
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

  private gmailValidator(control: AbstractControl): ValidationErrors | null {
    if (control.value && !control.value.endsWith('@gmail.com')) {
      return { notGmail: true };
    }
    return null;
  }
  
  onSubmit(): void {
    const url = "https://kajas-backend.onrender.com";
    this.submitted = true;
  
    if (this.forgotPasswordForm.invalid) {
      this.modalMessage = 'Please fill out the form correctly.';
      this.showModal = true;
      return;
    }

    this.modalMessage = 'Loading...';
    this.showLoader = true;
  
    axios.post(`${url}/send/resetLink`, {
      email: this.forgotPasswordForm.value.email
    })
    .then((response: AxiosResponse) => {
      if (response.status === 200) {
        this.showLoader = false;
        this.modalMessage = 'Email to reset your password has been sent. Please check your inbox.';
        this.showModal = true;
      }
    })
    .catch((error: AxiosError) => {
      this.showLoader = false;
      this.modalMessage = 'That email address is not linked to a Kajas account. Try again or create a new one.';
      this.showModal = true;
      console.error('Error sending the email for resetting the password:', error);
    });
  }
  
  getEmailErrorMessage(): string {
    const emailControl = this.forgotPasswordForm.get('email');
    if (emailControl.hasError('required')) {
      return 'Email is required.';
    } else if (emailControl.hasError('email')) {
      return 'Must be a valid email address.';
    } else if (emailControl.hasError('notGmail')) {
      return 'Email must be a valid Google mail address.';
    }
    return '';
  }

  onCancel(): void {
    this.router.navigate(['/login']);
  }

  closeModal(): void {
    this.showModal = false;
  }  
}
