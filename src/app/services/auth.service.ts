import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LooseObject } from '../interfaces/looseobject/looseobject';
import { BehaviorSubject, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  emailregex = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  private rootUrl = `${environment.Host}/api/Users`;
  private authToken: string;
  private authTokenSource = new BehaviorSubject<string>(undefined);
  observeAuthToken = this.authTokenSource.asObservable();

  private userId: number;
  private userIdSource = new BehaviorSubject<number>(undefined);
  observeUserId = this.userIdSource.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.authToken = localStorage.getItem('token') || undefined;
    this.authTokenSource.next(this.authToken);

    this.userId = parseInt(localStorage.getItem('userId'), 10) || undefined;
    this.userIdSource.next(this.userId);
    this.verifyToken();
  }
  verifyToken(cb?: Function): void {
    if (this.userId && this.authToken) {
      const url = `${this.rootUrl}/api/${this.userId}?access_token=${this.authToken}`;
      this.http.get(url).subscribe(res => {
        const response: LooseObject = res;
        if (cb) { cb(null, response); }
      }, err => {
        if (err.status) {
          this.authToken = undefined;
          this.userId = undefined;
          this.authTokenSource.next(this.authToken);
          this.userIdSource.next(this.userId);
          localStorage.removeItem('userId');
          localStorage.removeItem('token');
          this.router.navigate(['signin']);
        }
        if (cb) { cb(err, null); }
      });
    } else { if (cb) { cb(null, false); } }
  }
  signUp(user: LooseObject, cb?: Function): void {
    if (this.userId && this.authToken) {
      if (cb) { return cb(null, { error: true, message: 'Already logged in.' }); }
      // this.router.navigate(['dashboard']);
      return;
    }
    if (!this.emailregex.test(user.email) || !user.name.trim() || !user.password.trim()) {
      alert('Invalid details');
      return;
    }
    const url = `${this.rootUrl}`;
    const authUser = {
      name: user.name.trim(),
      email: user.email.trim(),
      password: user.password.trim()
    };
    this.http.post(url, authUser).subscribe(res => {
      const response: LooseObject = res;
      if (cb) { alert('signup succeeded'); cb(null, response); this.router.navigate(['signin']) }
    }, err => {
      alert('Cannot create user');
      if (cb) { cb(err, null); }
    });

  }

  signIn(user: LooseObject, cb?: Function): void {
    const url = `${environment.Host}/api/Users/login`;
    if (user) {
      const authUser = {
        email: user.email.trim(),
        password: user.password.trim()
      };
      this.http.post(url, authUser).subscribe(res => {
        const response: LooseObject = res;
        if (response.id) {
          this.authToken = response.id;
          this.authTokenSource.next(this.authToken);

          this.userId = response.userId;
          this.userIdSource.next(this.userId);

          localStorage.setItem('token', this.authToken);
          localStorage.setItem('userId', this.userId + '');
          this.router.navigate(['dashboard']);
          alert('login succeeeded');
        } else {

        }
        if (cb) { cb(null, response); }
      }, err => {
        alert('Invalid details');
        if (cb) {
          cb(err, null);

          console.log('in errrorrrr');

        }
      });
    }
  }
  signout(cb?: Function): void {
    const url = `${this.rootUrl}/api/logout?access_token=${this.authToken}`;
    localStorage.removeItem('token');
    localStorage.removeItem('userId');

    this.authToken = undefined;
    this.authTokenSource.next(this.authToken);

    this.userId = undefined;
    this.userIdSource.next(this.userId);
    this.http.post(url, {}).subscribe(res => {
    }, err => {
      if (cb) {
        cb(err, null);
      }
    })

  }
}
