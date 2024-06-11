import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionStorageService } from 'angular-web-storage';

export const AuthGuard: CanActivateFn = (route, state) => {
  const session = inject(SessionStorageService);
  const router = inject(Router);
  
  const userId = session.get('id');
  if (!userId) {
    router.navigate(['/login']);
    return false;
  }
  return true;
};
