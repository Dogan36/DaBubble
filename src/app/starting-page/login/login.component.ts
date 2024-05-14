import { NgClass, NgIf } from '@angular/common';
import { Component, ElementRef, Renderer2, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginService } from '../../services/login.service';
import { OverlayService } from '../../services/overlay.service';
import { GuestUserService } from '../../services/guest-user.service';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgClass, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  myForm: FormGroup;
  authService: AuthService = inject(AuthService);
  loginService: LoginService = inject(LoginService);
  guestUserService: GuestUserService = inject(GuestUserService);
  loginError: string | null = null;
  constructor(private fb: FormBuilder, private renderer: Renderer2,
    private el: ElementRef, private overlayService:OverlayService) {
    this.myForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  async onSubmit() {
    this.saveVariables();
    try {
      await this.authService.login();
   
    } catch (error) {
      this.loginError = '*Email oder Password falsch.';
    }
  }


  async saveVariables() {
    this.authService.email = this.myForm.value['email'];
    this.authService.password = this.myForm.value['password'];
    ;
  }
  get emailError() {
    const emailControl = this.myForm.get('email');
    const value = emailControl?.value as string;
    if (emailControl?.hasError('required')) {
      return '*Bitte geben Sie Ihre E-Mail-Adresse ein';
    }
    if (value && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
      return '*Diese E-Mail-Adresse ist leider ungültig';
    }
    return '';
  }

  get passwordError() {
    const passwordControl = this.myForm.get('password');
    if (passwordControl?.hasError('required')) {
      return '*Bitte geben Sie Ihr Password ein';
    }
    return '';
  }

  loginWithGoogle() {
    this.authService.loginWithGoogle()
  }
}