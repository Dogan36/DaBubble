import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-signuppicture',
  standalone: true,
  imports: [],
  templateUrl: './signuppicture.component.html',
  styleUrl: './signuppicture.component.scss'
})
export class SignuppictureComponent {
  authService: AuthService = inject(AuthService);

  register(){
    this.authService.register();
  }
}
