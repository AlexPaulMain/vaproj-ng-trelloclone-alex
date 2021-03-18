import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, timer, Observable, Subject } from 'rxjs';
import { map, switchMap, takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';

/* Models */
import { UserSession } from '../models/user-session.model';
import { APIURL } from '../models/api.model';
import { Tokens } from '../models/tokens.model';
import { User } from '../models/user.model';
import { AccessToken } from '../models/access-token.model';

@Injectable()
export class AuthenticationService {
  currentUserSession: BehaviorSubject<UserSession>;
  refreshObs: Observable<number>;
  isLogout: Subject<boolean>;

  constructor(private http: HttpClient, public router: Router) {
    if (localStorage.getItem('userSession')) {
      console.log(
        'Local storage userSession found. Set currentUserSession BehaviourSubject to the local userSession.'
      );
      this.currentUserSession = new BehaviorSubject({} as UserSession);
      this.currentUserSession.next(
        JSON.parse(localStorage.getItem('userSession'))
      );
      console.log('currentUserSession', this.currentUserSession);
    } else {
      console.log(
        'No local storage userSession found. Create new userSession.'
      );
      this.currentUserSession = new BehaviorSubject({} as UserSession);
      localStorage.setItem(
        'userSession',
        JSON.stringify(this.currentUserSession.value)
      );
    }

    this.isLogout = new Subject<boolean>();
  }

  requestTokens(loginCredentials) {
    return this.http.post<Tokens>(`${APIURL}/token/`, loginCredentials).pipe(
      map((tokens: Tokens) => {
        let userSession: UserSession = { ...tokens };
        console.log('currentUserSession', this.currentUserSession);
        this.currentUserSession.next(userSession);
        localStorage.setItem(
          'userSession',
          JSON.stringify(this.currentUserSession.value)
        );
        return userSession;
      })
    );
  }

  requestUser(userSession) {
    return this.http.get(`${APIURL}/currentuser/`).pipe(
      map((user: User) => {
        userSession = { ...user, ...userSession };
        this.currentUserSession.next(userSession);
        localStorage.setItem(
          'userSession',
          JSON.stringify(this.currentUserSession.value)
        );
        return this.currentUserSession.value;
      })
    );
  }

  login(loginCredentials) {
    return this.requestTokens(loginCredentials).pipe(
      switchMap((userSession: UserSession) => this.requestUser(userSession))
    );
  }

  getAccessToken() {
    let userSession = JSON.parse(localStorage.getItem('userSession'));
    return userSession.access;
  }

  getRefreshToken() {
    let userSession = JSON.parse(localStorage.getItem('userSession'));
    return userSession.refresh;
  }

  startInterval() {
    console.log('Interval started');
    this.refreshObs = timer(1000, 60000 * 4);
  }

  startTokenRefresh() {
    this.refreshObs
      .pipe(takeUntil(this.isLogout))
      .subscribe((x) => this.refreshAccessToken());
  }

  refreshAccessToken() {
    let tempUserSession: UserSession = this.currentUserSession.value;
    return this.http
      .post(`${APIURL}/token/refresh/`, { refresh: this.getRefreshToken() })
      .pipe(
        map((token: AccessToken) => {
          tempUserSession.access = token.access;
          this.currentUserSession.next(tempUserSession);
          localStorage.setItem(
            'userSession',
            JSON.stringify(this.currentUserSession.value)
          );
          console.log('Refreshed token');
        })
      )
      .subscribe();
  }

  isAuthenticated(): boolean {
    console.log('currentUserSession', this.currentUserSession);
    if (JSON.parse(localStorage.getItem('userSession')).access) {
      console.log('User authenticated');
      return true;
    }
    console.log('User not authenticated');
    return false;
  }

  logout() {
    this.isLogout.next();
    this.router.navigate(['login']);
    this.currentUserSession.next({} as UserSession);
    localStorage.removeItem('userSession');
    localStorage.setItem('userSession', JSON.stringify({} as UserSession));
  }
}
