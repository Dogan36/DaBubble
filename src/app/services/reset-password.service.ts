import { Injectable, inject } from '@angular/core';
import { AuthService } from './auth.service';
import { verifyPasswordResetCode, confirmPasswordReset, } from "firebase/auth";
import { Firestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordService {

  private authService = inject(AuthService);
  private actionCode: string;

  constructor() {
    this.actionCode = this.getParameterByName('oobCode') || '';
    console.log(this.actionCode)
  }

  private getParameterByName(name: string, url = window.location.href) {
    console.log(url);
    name = name.replace(/[[]]/g, "\\$&");
    const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
      console.log(results);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }

  public handleResetPassword() {
    console.log('test')
    if (this.actionCode) {
      verifyPasswordResetCode(this.authService.auth, this.actionCode).then((email) => {
        const accountEmail = email;
        console.log(email)
        // TODO: Show the reset screen with the user's email and ask the user for the new password.
        const newPassword = "...";

        // Save the new password.

      });
    }
  }
  
}