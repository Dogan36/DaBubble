import { Component, ElementRef, Renderer2, inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { LoginService } from '../services/login.service';
import { Router, RouterLink } from '@angular/router';
import { ResetPasswordService } from '../services/reset-password.service';
@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, RouterLink,],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {
  myForm: FormGroup;
  authService: AuthService = inject(AuthService);
  loginService: LoginService = inject(LoginService)
  resetPasswordService: ResetPasswordService = inject(ResetPasswordService);
  constructor(private fb: FormBuilder, private renderer: Renderer2,
    private el: ElementRef, public router: Router) {
    this.myForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(7)]],
      passwordRepeat: ['', Validators.required]
    });
  }
  password: string = ''

  onSubmit() {
    if (this.myForm.valid) {
      this.password = this.myForm.value['password'];
      this.resetPasswordService.handleResetPassword()
    }
  }

  get passwordError() {
    const passwordControl = this.myForm.get('password');
    if (passwordControl?.hasError('required')) {
      return '*Bitte geben Sie ein Passwort ein';
    }
    if (passwordControl?.hasError('minlength')) {
      return '*Das Passwort muss mindestens 7 Zeichen enthalten';
    }
    return '';
  }

  get passwordRepeatError() {
    const passwordControl = this.myForm.get('password');
    const passwordRepeatControl = this.myForm.get('passwordRepeat');
    if (passwordControl && passwordRepeatControl && passwordControl.value !== passwordRepeatControl.value) {
      return '*Passwörter stimmen nicht überein';
    }
    return '';
  }

  validatePasswordRepeat() {
    const passwordControl = this.myForm.get('password');
    const passwordRepeatControl = this.myForm.get('passwordRepeat');
    if (passwordControl && passwordRepeatControl && passwordControl.value !== passwordRepeatControl.value) {
      // Setze das entsprechende Formularfeld auf "berührt", damit Fehler angezeigt werden können
      passwordRepeatControl.markAsTouched();
    }
  }
}

