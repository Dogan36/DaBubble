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
  toggleSignUp() {
    this.showLogin = !this.showLogin;
    this.showSignUp = !this.showSignUp;
  }

  toggleToPicture() {
    this.showSignUp = !this.showSignUp;
    this.showSignUpPicture = !this.showSignUpPicture;
  }

  toggleOwnPicture() {
    this.showSignUpPictureUpload = !this.showSignUpPictureUpload
    this.showSignUpPicture = !this.showSignUpPicture;
  }

  toggleResetPasswort() {
    this.showLogin = !this.showLogin;
    this.showResetPassword = !this.showResetPassword;
  }

  toggleLogin() {
    this.showSignUpPicture = !this.showSignUpPicture;
    this.showLogin = !this.showLogin;
  }

}
