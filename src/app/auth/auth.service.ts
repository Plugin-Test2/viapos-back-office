import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {BehaviorSubject, Observable} from 'rxjs';
import { User } from '../data-objects/user';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import { Auth } from 'aws-amplify';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Access-Control-Allow-Headers': 'Content-Type',
  })
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userSubject: BehaviorSubject<User>;
  public user;

  public loggedIn: BehaviorSubject<boolean>;

  constructor(
    private router: Router,
    private http: HttpClient
  ) {
    // this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
    // this.user = this.userSubject.asObservable();
  }

  public get userValue(): User {
    return this.userSubject.value;
  }

  login(email, password) {
    // return this.http.post<User>(`${environment.backendEndpoint}/v1/users/login`, { username, password }, httpOptions)
    //   .pipe(map(user => {
    //     // store user details and jwt token in local storage to keep user logged in between page refreshes
    //     localStorage.setItem('user', JSON.stringify(user));
    //     this.userSubject.next(user);
    //     return user;
    //   }));
    return Auth.signIn(email, password).then((user) => {
      localStorage.removeItem('user');
      localStorage.setItem('user', JSON.stringify(user));
    });
  }

  isLoggedIn() {
    return Auth.currentAuthenticatedUser();
  }

  logout() {
    // remove user from local storage and set current user to null
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }
}
