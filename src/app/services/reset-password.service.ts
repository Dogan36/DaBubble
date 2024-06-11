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
  }

  /**
   * This function gets parametes of the url
   *
   * @param url {String} This is the url with the parametes
   * @returns decoded Uri component
   */
  private getParameterByName(name: string, url = window.location.href) {
    name = name.replace(/[[]]/g, "\\$&");
    const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }

  /**
   * This function saves the new password
   * @param newPassword {String} This is the new password
   */
  public async handleResetPassword(newPassword: string): Promise<void> {
    if (this.actionCode) {
      try {
        const email = await verifyPasswordResetCode(this.authService.auth, this.actionCode);
        await confirmPasswordReset(this.authService.auth, this.actionCode, newPassword);
      } catch (error) {
        console.error('Error resetting password:', error);
        throw error;
      }
    } else {
      console.error('No action code provided.');
      throw new Error('No action code provided.');
    }
  }
}