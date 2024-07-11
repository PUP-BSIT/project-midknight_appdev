import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import axios from 'axios';

export const UserExistsGuard: CanActivateFn = (route, state) => {
  const router: Router = inject(Router);
  const username = route.paramMap.get('username');

  return axios.get(`https://api.kajas.site/api/profile/${username}`)
    .then(response => {
      if (response.status === 200) {
        return true;
      } else {
        router.navigate(['/login']);
        return false;
      }
    })
    .catch(error => {
      console.error('Error checking user existence:', error);
      router.navigate(['invalid-user']);
      return false;
    });
};
