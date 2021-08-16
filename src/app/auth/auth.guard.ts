import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { AuthService } from './auth.service';
import {LoginService} from '../services/login.service';
import {CognitoUtil} from '../services/cognito.service';
import {AwsUtil} from '../services/aws.service';

export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // return this.loginService.isAuthenticated()
    //   .then(authenticated => {
    //     if (authenticated) {
    //       return true;
    //     } else {
    //       localStorage.setItem('auth_redirect_url', state.url);
    //       this.router.navigate(['/login']);
    //       return false;
    //     }
    //   });
    return this.authService.isLoggedIn().then(data => {
      return true;
    }).catch(err => {
      this.router.navigate(['/login']);
      return false;
    });
  }

  isLoggedIn(message: string, isLoggedIn: boolean) {
    console.log('AppComponent: the user is authenticated: ' + isLoggedIn);
    if (isLoggedIn) {
      return true;
    } else {
      return false;
    }
  }
}
