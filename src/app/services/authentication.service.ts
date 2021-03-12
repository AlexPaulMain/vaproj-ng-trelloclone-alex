import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {
  BehaviorSubject,
  interval,
  Observable,
  throwError} from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
/* Services */

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

  constructor(private http: HttpClient) {
    this.currentUserSession = new BehaviorSubject({});
    localStorage.setItem('userSession', JSON.stringify(this.currentUserSession));
    this.refreshObs = interval(60000 *4);
  }

  requestTokens(loginCredentials) {
    return this.http.post<Tokens>(`${APIURL}/token/`, loginCredentials)
    .pipe(
      map((tokens: Tokens) => {
        let userSession: UserSession = {...tokens};
        this.currentUserSession.next(userSession);
        localStorage.setItem('userSession', JSON.stringify(this.currentUserSession));
        this.startTokenRefresh();
        return userSession;
      })
    )
  }

  requestUser(userSession) {
    return this.http.get(`${APIURL}/currentuser/`)
    .pipe(
      map((user: User) => {
        userSession = {...user, ...userSession};
        this.currentUserSession.next(userSession);
        localStorage.setItem('userSession', JSON.stringify(this.currentUserSession));
        return this.currentUserSession.value;
      })
    );
  }

  login(loginCredentials) {
    return this.requestTokens(loginCredentials)
    .pipe(
      switchMap((userSession: UserSession) =>
        this.requestUser(userSession)
      )
    );
  }

  getAccessToken() {
    let userSession = JSON.parse(localStorage.getItem("userSession"));
    return userSession._value.access;
  }

  getRefreshToken() {
    let userSession = JSON.parse(localStorage.getItem("userSession"));
    return userSession._value.refresh;

  }

  startTokenRefresh() {
    this.refreshObs.subscribe(x => this.refreshAccessToken());
  }

  refreshAccessToken() {
    let tempUserSession: UserSession = this.currentUserSession.value;
    return this.http.post(`${APIURL}/token/refresh/`, {'refresh': this.getRefreshToken()})
    .pipe(
      map((token: AccessToken) => {
        tempUserSession.access = token.access;
        this.currentUserSession.next(tempUserSession);
        localStorage.setItem('userSession', JSON.stringify(this.currentUserSession));
        console.log('Refreshed token');
      })
    ).subscribe()
  }

  isAuthenticated(): boolean {
    if (this.currentUserSession.value.access) {
      return true;
    }
    return false;
  }

}
