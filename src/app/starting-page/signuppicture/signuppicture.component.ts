import { Component, ElementRef, Renderer2 } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms'; // Nur die benötigten Teile aus dem @angular/forms importieren
import { NgFor } from '@angular/common';
import { OverlayService } from '../../services/overlay.service';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-signuppicture',
  imports: [NgFor],
  standalone: true,
  templateUrl: './signuppicture.component.html',
  styleUrls: ['./signuppicture.component.scss'] // 'styleUrls' anstatt 'styleUrl'
})
export class SignuppictureComponent {
  signingIn = false;
  signupForm: FormGroup; // Formulargruppe deklarieren
  pictures = [
    "./../../../assets/img/profils/avatar_1.svg",
    "./../../../assets/img/profils/avatar_2.svg",
    "./../../../assets/img/profils/avatar_3.svg",
    "./../../../assets/img/profils/avatar_4.svg",
    "./../../../assets/img/profils/avatar_5.svg",
    "./../../../assets/img/profils/avatar_6.svg"];
  constructor(private fb: FormBuilder, private renderer: Renderer2, public authService: AuthService, private router: Router, public overlayService: OverlayService, public loginService: LoginService) {
    this.authService = authService;
    this.router = router;
    this.signupForm = this.fb.group({
      // Definieren Sie hier Ihre Formularsteuerelemente
    });
  }

  /**
   * This function sets signingIn to true, calles register from authService, and calles showOverlayError if email is already in use
   */
  async register() {
    try {
      this.signingIn = true;
      await this.authService.register();
      this.signingIn = false;
      this.loginService.toggleLogin()
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        this.overlayService.showOverlayError('E-Mail bereits vergeben');
        setTimeout(() => {
          this.overlayService.hideOverlay()
          this.loginService.toggleToPicture()
        }, 3000);
        this.signingIn = false;
      }
    }
  }

  /**
   * This function sets the photoUrl in authService to the seleceted picture
   * 
   * @param i {String} Url of selected picture
   */
  selectPicture(i: string) {
    this.authService.photoURL = i
  }
}