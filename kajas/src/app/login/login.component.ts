import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  hidePassword: boolean = true;

  constructor(private renderer: Renderer2, private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    // Apply styles to html and body when the component is initialized
    this.renderer.setStyle(document.body, 'height', '100%');
    this.renderer.setStyle(document.body, 'margin', '0');
    this.renderer.setStyle(document.body, 'padding', '0');
    this.renderer.setStyle(document.body, 'overflow', 'hidden');
    this.renderer.setStyle(document.body, 'display', 'flex');
    this.renderer.setStyle(document.body, 'justify-content', 'center');
    this.renderer.setStyle(document.body, 'align-items', 'center');
    this.renderer.setStyle(document.body, 'background', 'url("../../assets/login_bg.png") center/cover no-repeat');
    
    this.renderer.setStyle(document.documentElement, 'height', '100%');
    this.renderer.setStyle(document.documentElement, 'margin', '0');
    this.renderer.setStyle(document.documentElement, 'padding', '0');
    this.renderer.setStyle(document.documentElement, 'overflow', 'hidden');
  }

  ngOnDestroy(): void {
    // Revert styles when the component is destroyed
    this.renderer.removeStyle(document.body, 'height');
    this.renderer.removeStyle(document.body, 'margin');
    this.renderer.removeStyle(document.body, 'padding');
    this.renderer.removeStyle(document.body, 'overflow');
    this.renderer.removeStyle(document.body, 'display');
    this.renderer.removeStyle(document.body, 'justify-content');
    this.renderer.removeStyle(document.body, 'align-items');
    this.renderer.removeStyle(document.body, 'background');
    
    this.renderer.removeStyle(document.documentElement, 'height');
    this.renderer.removeStyle(document.documentElement, 'margin');
    this.renderer.removeStyle(document.documentElement, 'padding');
    this.renderer.removeStyle(document.documentElement, 'overflow');
  }

  onSubmit() {
    if (this.loginForm.valid) {
      // Handle form submission
      console.log(this.loginForm.value);
    }
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }
}
