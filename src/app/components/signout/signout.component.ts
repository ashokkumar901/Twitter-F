import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service'
@Component({
  selector: 'app-signout',
  templateUrl: './signout.component.html',
  styleUrls: ['./signout.component.sass']
})
export class SignoutComponent implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }
  signout(): void {
    this.authService.signout();
  }
}
