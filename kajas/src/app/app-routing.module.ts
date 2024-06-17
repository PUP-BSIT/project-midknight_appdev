import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
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

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
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
  { path: '**', redirectTo: '/login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
