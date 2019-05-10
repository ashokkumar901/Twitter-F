import { Component, OnInit } from '@angular/core';
import { LooseObject } from '../../interfaces/looseobject/looseobject';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.sass']
})
export class SigninComponent implements OnInit {
  user: LooseObject = {
    email: '',
    password: ''
  };
  constructor(private authService: AuthService) { }

  ngOnInit() {
  }
  signIn(): void {
    this.authService.signIn(this.user);
  }

}
