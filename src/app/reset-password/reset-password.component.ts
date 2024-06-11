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
/**
 * This function saves new password and navigates to login page
 */
  onSubmit() {
    if (this.myForm.valid) {
      const newPassword = this.myForm.value['password'];
      this.resetPasswordService.handleResetPassword(newPassword)
        .then(() => {
          // Handle success, e.g., navigate to the login page
          this.router.navigate(['/login']);
        })
        .catch(error => {
          // Handle error
          console.error(error);
        });
    }
  }

/**
 * This funcion returns error messages if when password input is empty or hasn't the minimum length
 */

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

/**
 * This function returns error message if passwords are not the same
 */

  get passwordRepeatError() {
    const passwordControl = this.myForm.get('password');
    const passwordRepeatControl = this.myForm.get('passwordRepeat');
    if (passwordControl && passwordRepeatControl && passwordControl.value !== passwordRepeatControl.value) {
      return '*Passwörter stimmen nicht überein';
    }
    return '';
  }

  /**
   * This function markes the passwordRepeat input as touched
   */
  validatePasswordRepeat() {
    const passwordControl = this.myForm.get('password');
    const passwordRepeatControl = this.myForm.get('passwordRepeat');
    if (passwordControl && passwordRepeatControl && passwordControl.value !== passwordRepeatControl.value) {
      // Setze das entsprechende Formularfeld auf "berührt", damit Fehler angezeigt werden können
      passwordRepeatControl.markAsTouched();
    }
  }
}

