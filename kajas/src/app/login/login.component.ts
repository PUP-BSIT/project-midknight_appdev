import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { LoginResponse, User, LocationResponse } from '../../models/user.model';
import { SessionStorageService } from 'angular-web-storage';
import { fromEvent, Subscription } from 'rxjs';

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
  showLoader = false;
  resizeSubscription: Subscription | null = null;
  redirectUrl: string | null = null;
  loaderTimeout: any;

  constructor(
    private renderer: Renderer2,
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private sessionStorage: SessionStorageService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(6)
      ]]
    });
  }

  ngOnInit(): void {
    this.setInitialStyles();
    this.resizeSubscription = fromEvent(window, 'resize').subscribe(() => this.applyBackground());
  }

  ngOnDestroy(): void {
    this.revertStyles();
    if (this.resizeSubscription) {
      this.resizeSubscription.unsubscribe();
    }
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

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.http.post<LoginResponse>('http://localhost:4000/api/login', this.loginForm.value).subscribe(
        (response: LoginResponse) => {
          this.showLoader = true;
          this.handleLoginSuccess(response);
        },
        (error: any) => {
          this.handleError(error);
        }
      );
    } else {
      this.modalMessage = 'Please fill out the form accurately first.';
      this.showModal = true;
    }
  }

  private handleLoginSuccess(response: LoginResponse): void {
    this.modalMessage = 'Login Success! Welcome to Kajas!';
    this.saveUserData(response.user);

    this.loaderTimeout = setTimeout(() => {
      this.showLoader = false;
      this.showModal = false;
      if (this.redirectUrl) {
        this.router.navigateByUrl(this.redirectUrl);
        this.redirectUrl = null;
      }
    }, 2000);

    this.http.get<LocationResponse>(`http://localhost:4000/api/location/id?id=${response.user.user_id}`).subscribe(
      (locationResponse: LocationResponse) => {
        this.redirectUrl = locationResponse.isFirstTimeLogin ? '/setup-profile' : '/profile';
      },
      (error: any) => {
        console.error(error);
        this.modalMessage = 'An error occurred while fetching location data';
        this.showModal = true;
      }
    );
  }

  private handleError(error: any): void {
    this.modalMessage = error.error.message || 'An error occurred during login';
    this.showLoader = false;
    this.showModal = true;
    clearTimeout(this.loaderTimeout);
  }

  private saveUserData(user: User): void {
    this.sessionStorage.set('id', user.user_id);
    this.sessionStorage.set('username', user.username);
    this.sessionStorage.set('email', user.email);
    this.sessionStorage.set('first_name', user.first_name);
    this.sessionStorage.set('middle_name', user.middle_name);
    this.sessionStorage.set('last_name', user.last_name);
    this.sessionStorage.set('city', user.city);
    this.sessionStorage.set('country', user.country);
    this.sessionStorage.set('bio', user.bio);
    this.sessionStorage.set('profile', user.profile);
    this.sessionStorage.set('linkedin', user.linkedin);
    this.sessionStorage.set('facebook', user.facebook);
    this.sessionStorage.set('instagram', user.instagram);
    this.sessionStorage.set('website', user.website);
    this.sessionStorage.set('kajas_link', user.kajas_link);
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
