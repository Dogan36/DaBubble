import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  showLogin: boolean = true;
  showSignUp: boolean = false;
  showSignUpPicture: boolean = false;
  showSignUpPictureUpload = false;
  showResetPassword: boolean = false;
  constructor() { }

  /**
   * This function toogles the signup window
   */
  toggleSignUp() {
    this.showLogin = !this.showLogin;
    this.showSignUp = !this.showSignUp;
  }

  /**
   * This function toogles the signup picture window
   */
  toggleToPicture() {
    this.showSignUp = !this.showSignUp;
    this.showSignUpPicture = !this.showSignUpPicture;
  }

  /**
   * This function toogles the ownpicture window
   */
  toggleOwnPicture() {
    this.showSignUpPictureUpload = !this.showSignUpPictureUpload
    this.showSignUpPicture = !this.showSignUpPicture;
  }

  /**
   * This function toogles the reset password window
   */
  toggleResetPasswort() {
    this.showLogin = !this.showLogin;
    this.showResetPassword = !this.showResetPassword;
  }

  /**
   * This function toogles the login window
   */
  toggleLogin() {
    this.showSignUpPicture = !this.showSignUpPicture;
    this.showLogin = !this.showLogin;
  }

  /**
   * This function navigates to the login page
   */
  navigateToLogin(){
    window.location.href='/';
  }
}
