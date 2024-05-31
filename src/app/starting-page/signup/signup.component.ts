import { Component, ElementRef, Renderer2, inject } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { LoginService } from '../../services/login.service';
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
  loginService: LoginService = inject(LoginService)
  constructor(private fb: FormBuilder, private renderer: Renderer2,
    private el: ElementRef,) {
    this.myForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
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
  }

  onSubmit(event: Event) {
    if (this.myForm.valid) {
      this.email = this.myForm.value['email'];
      this.password = this.myForm.value['password'];
      this.name = this.myForm.value['name'];
      this.saveVariables();
      this.loginService.toggleToPicture();
    }
  }

  get emailError() {
    const emailControl = this.myForm.get('email');
    const value = emailControl?.value as string;
    if (emailControl?.hasError('required')) {
      return '*Bitte geben Sie Ihre E-Mail-Adresse ein';
    }
    if (emailControl?.hasError('pattern')) {
      return '*Diese E-Mail-Adresse ist leider ungültig';
    }
    return '';
  }

  get passwordError() {
    const passwordControl = this.myForm.get('password');
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

