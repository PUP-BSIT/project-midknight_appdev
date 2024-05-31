import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';


import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { AppRoutingModule } from './app-routing.module';
import { ModalService } from '../services/modal.service';
import { UserService } from '../services/user.service';
import { TermsModalComponent } from './terms-modal/terms-modal.component';
import { PrivacyModalComponent } from './privacy-modal/privacy-modal.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { HttpClientModule } from '@angular/common/http';
import { ModalMessageComponent } from './shared/modal-message/modal-message.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { HeaderComponent } from './header/header.component';
import { ProfileComponent } from './profile/profile.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistrationComponent,
    TermsModalComponent,
    PrivacyModalComponent,
    ForgotPasswordComponent,
    ModalMessageComponent,
    ResetPasswordComponent,
    HeaderComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [ 
    ModalService,
    UserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
