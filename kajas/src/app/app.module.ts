import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms'; 

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
import { SetupProfileComponent } from './setup-profile/setup-profile.component';
import { LocationService } from '../services/location.service';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { AddArtworkComponent } from './add-artwork/add-artwork.component';
import { SearchService } from '../services/search.service';
import { ArtworkDetailsComponent } from './artwork-details/artwork-details.component';
import { CtaBannerComponent } from './cta-banner/cta-banner.component';
import { ArtworkService } from '../services/artwork.service';
import { ConfirmCancelModalComponent } from './shared/confirm-cancel-modal/confirm-cancel-modal.component';
import { EditArtworkComponent } from './edit-artwork/edit-artwork.component';
import { CtaHeaderComponent } from './cta-header/cta-header.component';

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
    ProfileComponent,
    SetupProfileComponent,
    EditProfileComponent,
    AddArtworkComponent,
    ArtworkDetailsComponent,
    CtaBannerComponent,
    ConfirmCancelModalComponent,
    EditArtworkComponent,
    CtaHeaderComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule, 
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [ 
    ModalService,
    UserService,
    LocationService,
    SearchService,
    ArtworkService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}