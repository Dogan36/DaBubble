import { Component, ElementRef, Renderer2, inject } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import { FormBuilder, FormGroup,  ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { RouterLink } from '@angular/router';



@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgClass, RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  myForm: FormGroup;
  authService: AuthService = inject(AuthService);
  constructor(private fb: FormBuilder, private renderer: Renderer2,
    private el: ElementRef,) {
    this.myForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(7)]],
      name: ['', Validators.required]
    });
  }

  email: string = '';
  password: string = '';
  name: string = '';

  saveVariables() {
    this.authService.email = this.email;
    this.authService.password = this.password;
    this.authService.name = this.name;
    ;
  }
  onSubmit() {
    this.saveVariables();
    this.toggleToPicture();
  }

  toggleToPicture(){
    this.authService.showSignUp = false;
    this.authService.showSignUpPicture = true;
  }

  toggleToLogin() {
    this.authService.showLogin = true;
    this.authService.showSignUp = false;
  }

  get emailError() {
    const emailControl = this.myForm.get('email');

    if (emailControl?.hasError('required')) {
      return '*Bitte geben Sie Ihre E-Mail-Adresse ein';
    }
    if (emailControl?.hasError('email')) {
      return '*Diese E-Mail-Adresse ist leider ungültig';
     
    }
    return '';
  }

  get passwordError() {
    const passwordControl = this.myForm.get('password');
    console.log(passwordControl)
    if (passwordControl?.hasError('required')) {
      return '*Bitte geben Sie ein Password ein';
    }
    if (passwordControl?.hasError('minlength')) {
      return '*Das Passwort muss mindestens 7 Zeichen enthalten';
    
    }
    return '';
  }

  get nameError() {
    const nameControl = this.myForm.get('name');

    if (nameControl?.hasError('required')) {
      return '*Bitte geben Sie Ihren Namen ein';
    }
    return '';
  }
}

