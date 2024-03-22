import { NgClass, NgIf } from '@angular/common';
import { Component, ElementRef, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgClass, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
onSubmit() {
throw new Error('Method not implemented.');
}
  myForm: FormGroup;

  constructor(private fb: FormBuilder, private renderer: Renderer2,
    private el: ElementRef,) {
    this.myForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
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

  if (passwordControl?.hasError('required')) {
    return '*Bitte geben Sie Ihr Password ein';
  }
  return '';
}
}