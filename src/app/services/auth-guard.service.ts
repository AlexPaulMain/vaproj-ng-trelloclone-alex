import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(
    public authenticationService: AuthenticationService,
    public router: Router
  ) {}

  canActivate(): boolean {
    if (!this.authenticationService.isAuthenticated()) {
      // this.router.navigate(['login']);
      console.log('This route is not allowed');
      this.authenticationService.logout();
      console.log('Automatic logout');
      return false;
    }
    console.log('This route is allowed');
    return true;
  }
}
