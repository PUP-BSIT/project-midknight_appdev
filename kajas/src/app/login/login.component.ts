import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  hidePassword: boolean = true;
  showModal: boolean = false;
  modalMessage: string = '';

  constructor(
    private renderer: Renderer2,
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
    this.setInitialStyles();
    window.addEventListener('resize', this.applyBackground.bind(this));
  }

  ngOnDestroy(): void {
    this.revertStyles();
    window.removeEventListener('resize', this.applyBackground.bind(this));
  }

  private setInitialStyles(): void {
    this.renderer.setStyle(document.body, 'height', '100%');
    this.renderer.setStyle(document.body, 'overflow', 'hidden');
    this.renderer.setStyle(document.body, 'display', 'flex');
    this.renderer.setStyle(document.body, 'justify-content', 'center');
    this.renderer.setStyle(document.body, 'align-items', 'center');
    this.renderer.setStyle(
      document.body,
      'background',
      'url("../../assets/login_bg.png") center/cover no-repeat'
    );

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
    if (window.innerWidth <= 425) {
      this.renderer.setStyle(
        document.body,
        'background',
        'url("../../assets/login_mbg.png") center/cover no-repeat'
      );
    } else {
      this.renderer.setStyle(
        document.body,
        'background',
        'url("../../assets/login_bg.png") center/cover no-repeat'
      );
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.http
        .post('http://localhost:4000/api/login', this.loginForm.value)
        .subscribe(
          (response: any) => {
            this.modalMessage = 'Login Success! Welcome to Kajas!';
            this.showModal = true;

            setTimeout(() => {
              console.log('Navigating to /signup');
              this.router.navigateByUrl('/signup');
            }, 1000);
          },
          (error: any) => {
            this.modalMessage =
              error.error.message || 'An error occurred during login';
            this.showModal = true;
          }
        );
    } else {
      this.modalMessage = 'Please fill out the form accurately first.';
      this.showModal = true;
    }
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  closeModal(): void {
    this.showModal = false;
  }
}
