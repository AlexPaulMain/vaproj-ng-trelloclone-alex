import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  BehaviorSubject,
  timer,
  Observable,
  Subject,
  Subscription,
} from 'rxjs';
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

  /**
   * Requests the JWT tokens from the api
   * @param loginCredentials login credentials of type User from form data
   * @returns Observable of type UserSession
   */
  requestTokens(loginCredentials): Observable<UserSession> {
    return this.http.post<Tokens>(`${APIURL}/token/`, loginCredentials).pipe(
      map((tokens: Tokens) => {
        const userSession: UserSession = { ...tokens };
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

  /**
   * Requests user details from api
   * @param userSession UserSession object
   * @returns Observable of type UserSession with updated user details
   */
  requestUser(userSession): Observable<UserSession> {
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

  /**
   * Populates the UserSession model with tokens and user details
   * @param loginCredentials login credentials of type User from form data
   * @returns Observable of type UserSession
   */
  login(loginCredentials): Observable<UserSession> {
    return this.requestTokens(loginCredentials).pipe(
      switchMap((userSession: UserSession) => this.requestUser(userSession))
    );
  }

  /**
   * Retrieves locally stored userSession object
   * @returns JWT access token
   */
  getAccessToken(): string {
    const userSession = JSON.parse(localStorage.getItem('userSession'));
    return userSession.access;
  }

  /**
   * Retrieves locally stored userSession object
   * @returns JWT refresh token
   */
  getRefreshToken(): string {
    const userSession = JSON.parse(localStorage.getItem('userSession'));
    return userSession.refresh;
  }

  /**
   * Assigns refreshObs to timer observable
   */
  startInterval(): void {
    console.log('Interval started');
    this.refreshObs = timer(1000, 60000 * 4);
  }

  /**
   * Subscribes to refreshObs timer observable and runs token refresh function every interval
   */
  startTokenRefresh(): void {
    this.refreshObs
      .pipe(takeUntil(this.isLogout))
      .subscribe((x) => this.refreshAccessToken());
  }

  /**
   * Uses refresh token to get new access token and updates local storage
   * @returns Subscription
   */
  refreshAccessToken(): Subscription {
    const tempUserSession: UserSession = this.currentUserSession.value;
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

  /**
   * Checks if user is authenticated by seeing if an access token is stored locally
   * @returns boolean
   */
  isAuthenticated(): boolean {
    console.log('currentUserSession', this.currentUserSession);
    if (JSON.parse(localStorage.getItem('userSession')).access) {
      console.log('User authenticated');
      return true;
    }
    console.log('User not authenticated');
    return false;
  }

  /**
   * logs the user out by routing to the login page and clearing local storage
   */
  logout(): void {
    this.isLogout.next();
    this.router.navigate(['login']);
    this.currentUserSession.next({} as UserSession);
    localStorage.removeItem('userSession');
    localStorage.setItem('userSession', JSON.stringify({} as UserSession));
  }
}
