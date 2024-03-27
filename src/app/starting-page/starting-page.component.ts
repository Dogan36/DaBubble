import { Component, inject} from '@angular/core';
import { SignupComponent } from './signup/signup.component';
import  { LoginComponent } from './login/login.component' ;
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { SignuppictureComponent } from './signuppicture/signuppicture.component';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';


@Component({
  selector: 'app-starting-page',
  standalone: true,
  imports: [
  SignupComponent,
  ForgotPasswordComponent,
  LoginComponent,
  SignuppictureComponent,
  FormsModule,
  NgIf,
  RouterLink
  ],
  templateUrl: './starting-page.component.html',
  styleUrl: './starting-page.component.scss'
})

export class StartingPageComponent {

  constructor(public router:Router) {}
  authService: AuthService = inject(AuthService);
 


}
