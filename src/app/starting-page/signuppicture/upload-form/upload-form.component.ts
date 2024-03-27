import { Component, inject } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { ImageUploadService } from '../../../services/image-upload.service';
import { User } from 'firebase/auth';
@Component({
  selector: 'app-upload-form',
  standalone: true,
  imports: [],
  templateUrl: './upload-form.component.html',
  styleUrl: './upload-form.component.scss'
})
export class UploadFormComponent {
  authService: AuthService = inject(AuthService);
  imageuploadService: ImageUploadService = inject(ImageUploadService);

  uploadImage(event: any) {

    this.imageuploadService.uploadImage(event.target.files[0])
  }
}
