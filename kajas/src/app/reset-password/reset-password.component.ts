import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import axios from 'axios';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  resetPasswordForm: FormGroup;
  token: string;
  submitted = false;
  errorMessage: string = '';
  showModal: boolean = false;
  modalMessage: string = '';

  constructor(
    private renderer: Renderer2,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.resetPasswordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmNewPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
    this.token = '';
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token')!;
    if (!this.token) {
      this.modalMessage = 'Invalid Token';
      this.showModal = true;
    }

    this.renderer.setStyle(document.body, 'height', '100%');
    this.renderer.setStyle(document.body, 'overflow', 'hidden');
    this.renderer.setStyle(document.body, 'display', 'flex');
    this.renderer.setStyle(document.body, 'justify-content', 'center');
    this.renderer.setStyle(document.body, 'align-items', 'center');
    this.renderer.setStyle(document.body, 'background', 'url("../../assets/login_bg.png") center/cover no-repeat');

    this.renderer.setStyle(document.documentElement, 'height', '100%');
    this.renderer.setStyle(document.documentElement, 'overflow', 'hidden');
    this.applyBackground();
    window.addEventListener('resize', () => {
      this.applyBackground();
    });
  }

  ngOnDestroy(): void {
    this.renderer.removeStyle(document.body, 'height');
    this.renderer.removeStyle(document.body, 'overflow');
    this.renderer.removeStyle(document.body, 'display');
    this.renderer.removeStyle(document.body, 'justify-content');
    this.renderer.removeStyle(document.body, 'align-items');
    this.renderer.removeStyle(document.body, 'background');

    this.renderer.removeStyle(document.documentElement, 'height');
    this.renderer.removeStyle(document.documentElement, 'overflow');
    window.removeEventListener('resize', () => {});
  }

  applyBackground(): void {
    if (window.innerWidth <= 425) {
      this.renderer.setStyle(document.body, 'background', 'url("../../assets/login_mbg.png") center/cover no-repeat');
    } else {
      this.renderer.setStyle(document.body, 'background', 'url("../../assets/login_bg.png") center/cover no-repeat');
    }
  }

  get f() { return this.resetPasswordForm.controls; }

  async onSubmit(): Promise<void> {
    this.submitted = true;

    if (this.resetPasswordForm.invalid) {
      return;
    }

    const { newPassword, confirmNewPassword } = this.resetPasswordForm.value;

    if (newPassword !== confirmNewPassword) {
      this.modalMessage = 'Passwords do not match';
      this.showModal = true;
      return;
    }

    const url = "http://localhost:4000/api/reset-password";
    try {
      const response = await axios.post(url, {
        token: this.token,
        newPassword,
        confirmNewPassword
      });

      if (response.status === 200) {
        this.modalMessage = 'Password has been reset successfully. You can now log in with your new password.';
        this.showModal = true;
      }
    } catch (error) {
      this.modalMessage = error.response?.data?.message || 'Something went wrong. Please try again later.';
      this.showModal = true;
    }
  }

  closeModal() {
    this.showModal = false;
    if (this.modalMessage === 'Password has been reset successfully. You can now log in with your new password.') {
      this.router.navigate(['/login']);
    }
  }
}
