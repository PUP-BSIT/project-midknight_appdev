import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  hidePassword: boolean = true;

  constructor(
    private renderer: Renderer2,
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
    // Apply styles to html and body when the component is initialized
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
    window.addEventListener('resize', () => {
      this.applyBackground();
    });
  }

  ngOnDestroy(): void {
    // Revert styles when the component is destroyed
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
      // For mobile devices
      this.renderer.setStyle(
        document.body,
        'background',
        'url("../../assets/login_mbg.png") center/cover no-repeat'
      );
    } else {
      // For desktop
      this.renderer.setStyle(
        document.body,
        'background',
        'url("../../assets/login_bg.png") center/cover no-repeat'
      );
    }
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.http
        .post('http://localhost:4000/api/login', this.loginForm.value)
        .subscribe(
          (response: any) => {
            alert('Login successful');
          },
          (error: any) => {
            alert(error.error.message || 'An error occurred during login');
          }
        );
    }
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }
}
