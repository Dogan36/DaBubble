import { Component, ElementRef, Renderer2, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
  myForm: FormGroup;
  authService: AuthService = inject(AuthService);
  constructor(private fb: FormBuilder, private renderer: Renderer2,
    private el: ElementRef,){

    
    this.myForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
    });
  }
  email:string =''
  onSubmit() {
   
    if (this.myForm.valid) {
      this.email = this.myForm.value['email'];
      this.authService.sendPasswortReset(this.email)
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
}
