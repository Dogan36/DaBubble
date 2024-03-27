import { Component, ElementRef, Renderer2 } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms'; // Nur die benötigten Teile aus dem @angular/forms importieren
import { NgFor } from '@angular/common';


@Component({
  selector: 'app-signuppicture',
  imports: [NgFor],
  standalone: true,
  templateUrl: './signuppicture.component.html',
  styleUrls: ['./signuppicture.component.scss'] // 'styleUrls' anstatt 'styleUrl'
})
export class SignuppictureComponent {

  signupForm: FormGroup; // Formulargruppe deklarieren
  pictures = [
    "./../../../assets/img/profils/avatar_1.svg",
    "./../../../assets/img/profils/avatar_2.svg",
    "./../../../assets/img/profils/avatar_3.svg",
    "./../../../assets/img/profils/avatar_4.svg",
    "./../../../assets/img/profils/avatar_5.svg",
    "./../../../assets/img/profils/avatar_6.svg"];
  constructor(private fb: FormBuilder, private renderer: Renderer2, public authService: AuthService, private router: Router) {
    this.authService = authService; // Abhängigkeiten im Konstruktor setzen
    this.router = router;
    this.signupForm = this.fb.group({
      // Definieren Sie hier Ihre Formularsteuerelemente
    });
  }

  async register() {
    try {
      await this.authService.register();
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        console.log("email bereits in verwendung")
        setTimeout(() => {
          this.authService.toggleToPicture()
        }, 3000);
      }
    }
  }

  selectPicture(i:string){
    this.authService.photoURL = i
  }
}