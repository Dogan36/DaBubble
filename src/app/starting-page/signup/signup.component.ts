import { Component, EventEmitter, Input, Output, inject } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';



@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {


  authService: AuthService = inject(AuthService);

  email: string = '';
  password: string = '';
  name: string = '';

  async saveVariables() {
    this.authService.email = this.email;
    this.authService.password = this.password;
    this.authService.name = this.name;
   ;
  }

  toggleToLogin() {
    this.authService.showLogin = true;
    this.authService.showLogin = false;
  }
}

