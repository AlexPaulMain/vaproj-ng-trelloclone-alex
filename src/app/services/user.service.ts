import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

/* Models */
import { APIURL } from '../models/api.model';
import { User } from '../models/user.model';

@Injectable()
export class UserService {
  constructor(private http: HttpClient) {}

  updateUser(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${APIURL}/user/${id}/`, user);
  }
}
