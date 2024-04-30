import { Component, inject } from '@angular/core';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { SignuppictureComponent } from './signuppicture/signuppicture.component';
import { UploadFormComponent } from './signuppicture/upload-form/upload-form.component';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { LoginService } from '../services/login.service';
import { StartAnimationComponent } from './start-animation/start-animation.component';



@Component({
  selector: 'app-starting-page',
  standalone: true,
  imports: [
    SignupComponent,
    ForgotPasswordComponent,
    LoginComponent,
    SignuppictureComponent,
    UploadFormComponent,
    FormsModule,
    NgIf,
    RouterLink,
    StartAnimationComponent
  ],
  templateUrl: './starting-page.component.html',
  styleUrl: './starting-page.component.scss'
})

export class StartingPageComponent {

  constructor(public router: Router) { }
  authService: AuthService = inject(AuthService);
  loginService: LoginService = inject(LoginService);
 
}
