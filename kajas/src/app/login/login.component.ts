import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { SessionStorageService } from 'angular-web-storage';
import { fromEvent, Subscription } from 'rxjs';
import axios from 'axios';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  hidePassword = true;
  showModal = false;
  modalMessage = '';
  resizeSubscription: Subscription;
  redirectUrl: string | null = null;

  constructor(
    private renderer: Renderer2,
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private sessionStorage: SessionStorageService
  ) {
    this.loginForm = this.fb.group({
      email: ['', {
        validators: [
          Validators.required,
          Validators.email
        ]
      }],
      password: ['', {
        validators: [
          Validators.required,
          Validators.minLength(6)
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
    const backgroundUrl = window.innerWidth <= 425 ? '../../assets/login_mbg.png' : '../../assets/login_bg.png';
    this.renderer.setStyle(document.body, 'background', `url("${backgroundUrl}") center/cover no-repeat`);
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.valid) {
      this.http
        .post('http://localhost:4000/api/login', this.loginForm.value)
        .subscribe(
          async (response: any) => {
            this.modalMessage = 'Login Success! Welcome to Kajas!';
            this.showModal = true;
            console.log(response);
            this.sessionStorage.set('id', response.user.user_id);
            this.sessionStorage.set('username', response.user.username);
            this.sessionStorage.set('email', response.user.email);
            this.sessionStorage.set('first_name', response.user.first_name);
            this.sessionStorage.set('middle_name', response.user.middle_name);
            this.sessionStorage.set('last_name', response.user.last_name);
  
            const url = "http://localhost:4000";
            const id = response.user.user_id;
  
            try {
              const axiosResponse = await axios.get(`${url}/api/location/id?id=${id}`);
              if (axiosResponse.status === 200) {
                const isFirstTime = axiosResponse.data.isFirstTimeLogin;
                this.redirectUrl = isFirstTime ? '/setup-profile' : '/profile';
              }
            } catch (error) {
              console.error(error);
              this.modalMessage = 'An error occurred while fetching location data';
              this.showModal = true;
            }
          },
          (error: any) => {
            this.modalMessage = error.error.message || 'An error occurred during login';
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
    if (this.redirectUrl) {
      this.router.navigateByUrl(this.redirectUrl);
      this.redirectUrl = null; 
    }
  }
}
