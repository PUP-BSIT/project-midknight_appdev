import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalService } from '../../services/modal.service'; 
import axios from 'axios';
import { fromEvent, Subscription } from 'rxjs';

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

  constructor(
    private renderer: Renderer2,
    private fb: FormBuilder,
    private router: Router,
    private modalService: ModalService 
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', {
        validators: [
          Validators.required,
          Validators.email,
          this.gmailValidator
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
    this.renderer.setStyle(document.body, 'height', '100%');
    this.renderer.setStyle(document.body, 'overflow', 'hidden');
    this.renderer.setStyle(document.body, 'display', 'flex');
    this.renderer.setStyle(document.body, 'justify-content', 'center');
    this.renderer.setStyle(document.body, 'align-items', 'center');
    this.renderer.setStyle(document.body, 'background', 'url("../../assets/signup_bg.png") center/cover no-repeat');
    
    this.renderer.setStyle(document.documentElement, 'height', '100%');
    this.renderer.setStyle(document.documentElement, 'overflow', 'hidden');
    this.applyBackground();
  }

  private revertStyles(): void {
    this.renderer.removeStyle(document.body, 'height');
    this.renderer.removeStyle(document.body, 'overflow');
    this.renderer.removeStyle(document.body, 'display');
    this.renderer.removeStyle(document.body, 'justify-content');
    this.renderer.removeStyle(document.body, 'align-items');
    this.renderer.removeStyle(document.body, 'background');
    
    this.renderer.removeStyle(document.documentElement, 'height');
    this.renderer.removeStyle(document.documentElement, 'overflow');
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
  
  async onSubmit(): Promise<void> {
    const url = "http://localhost:4000";
    this.submitted = true;
  
    if (this.forgotPasswordForm.invalid) {
      this.modalMessage = 'Please fill out the form correctly.';
      this.showModal = true;
      return;
    }
  
    try {
      const response = await axios.post(`${url}/send/resetLink`, {
        email: this.forgotPasswordForm.value.email
      });
  
      if (response.status === 200) {
        this.modalMessage = 'Email to reset your password has been sent. Please check your inbox.';
        this.showModal = true;
      }
    } catch (error) {
      this.modalMessage = 'That email address is not linked to a Kajas account. Try again or create a new one.';
      this.showModal = true;
      console.error('Error sending the email for resetting the password:', error);
      this.errorMessage = error.response?.data?.message || 'Something went wrong. Please try again later.';
    }
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
