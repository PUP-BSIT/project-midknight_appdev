import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionStorageService } from 'angular-web-storage';

export const ProfileCompletionGuard: CanActivateFn = (route, state) => {
  const session = inject(SessionStorageService);
  const router = inject(Router);

  const userCountry = session.get('country');

  if (!userCountry) {
    router.navigate(['/setup-profile']);
    return false;
  }

  return true;
};
