import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms'; 

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { HomeHeaderComponent } from './home/home-header/home-header.component';
import { FeaturesComponent } from './home/features/features.component';
import { HowItWorksComponent } from './home/how-it-works/how-it-works.component';
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
import { SettingsComponent } from './settings/settings.component';
import { ChangeEmailComponent } from './settings/change-email/change-email.component';
import { ChangePasswordComponent } from './settings/change-password/change-password.component';
import { HelpAndSupportComponent } from './settings/help-and-support/help-and-support.component';
import { DeactivateAccountComponent } from './settings/deactivate-account/deactivate-account.component';
import { PublicProfileComponent } from './public-profile/public-profile.component';
import { PublicArtworkDetailsComponent } from './public-artwork-details/public-artwork-details.component';
import { TermsAndConditionsComponent } from './shared/terms-and-conditions/terms-and-conditions.component';
import { PrivacyPolicyComponent } from './shared/privacy-policy/privacy-policy.component';
import { EmailService } from '../services/email.service';
import { LoaderModalComponent } from './shared/loader-modal/loader-modal.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MaterialModule } from './material.module';
import { HeaderVisibilityService } from '../services/header-visibility.service';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component'

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HomeHeaderComponent,
    FeaturesComponent,
    HowItWorksComponent,
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
    CtaHeaderComponent,
    PublicProfileComponent,
    PublicArtworkDetailsComponent,
    SettingsComponent,
    ChangeEmailComponent,
    ChangePasswordComponent,
    HelpAndSupportComponent,
    DeactivateAccountComponent,
    TermsAndConditionsComponent,
    PrivacyPolicyComponent,
    LoaderModalComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule, 
    AppRoutingModule,
    HttpClientModule,
    MaterialModule
  ],
  providers: [ 
    HeaderVisibilityService,
    ModalService,
    UserService,
    LocationService,
    SearchService,
    ArtworkService,
    EmailService,
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}