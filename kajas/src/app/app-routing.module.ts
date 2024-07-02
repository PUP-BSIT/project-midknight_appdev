import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { UserExistsGuard } from './user-exists.guard';
import { HomeComponent } from './home/home.component';
import { FeaturesComponent } from './home/features/features.component';
import { HowItWorksComponent } from './home/how-it-works/how-it-works.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ProfileComponent } from './profile/profile.component';
import { SetupProfileComponent } from './setup-profile/setup-profile.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { AddArtworkComponent } from './add-artwork/add-artwork.component';
import { ArtworkDetailsComponent } from './artwork-details/artwork-details.component';
import { EditArtworkComponent } from './edit-artwork/edit-artwork.component';
import { SettingsComponent } from './settings/settings.component';
import { PublicProfileComponent } from './public-profile/public-profile.component';
import { PublicArtworkDetailsComponent } from './public-artwork-details/public-artwork-details.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'features', component: FeaturesComponent },
  { path: 'how-it-works', component: HowItWorksComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegistrationComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'signup', component: RegistrationComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'setup-profile', component: SetupProfileComponent, canActivate: [AuthGuard] },
  { path: 'edit-profile', component: EditProfileComponent, canActivate: [AuthGuard] },
  { path: 'add-artwork', component: AddArtworkComponent, canActivate: [AuthGuard] },
  { path: 'edit-artwork/:title', component: EditArtworkComponent, canActivate: [AuthGuard] },
  { path: 'artwork-details/:title', component: ArtworkDetailsComponent, canActivate: [AuthGuard] },
  { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard] },
  { path: 'profile/:username', component: PublicProfileComponent, canActivate: [UserExistsGuard]},
  { path: ':username/artwork-details/:title', component: PublicArtworkDetailsComponent, canActivate: [UserExistsGuard]},
  { path: '**', redirectTo: '/login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
