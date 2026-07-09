import { CanActivateFn, Router } from '@angular/router';
import { User } from './components/User';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const user = users.find((u:User) => u.isLoggedIn === true);
  if(!user){
    router.navigate(['/']);
  }
  return true;
};
