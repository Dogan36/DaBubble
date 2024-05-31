import { Component, inject } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, uploadBytes } from "firebase/storage";
import { ImageCropperModule } from 'ngx-image-cropper';
import { ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';
import { DomSanitizer } from '@angular/platform-browser';
import { HammerModule } from '@angular/platform-browser';
import { NgIf } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialog, MatDialogRef, MatDialogActions } from '@angular/material/dialog';
import { DialogChangeProfilpicComponent } from '../dialog-change-profilpic/dialog-change-profilpic.component';
@Component({
  selector: 'app-dialog-upload-new-picture',
  standalone: true,
  imports: [ImageCropperModule, NgIf, HammerModule, MatProgressBarModule, MatDialogActions],
  templateUrl: './dialog-upload-new-picture.component.html',
  styleUrl: './dialog-upload-new-picture.component.scss'
})
export class DialogUploadNewPictureComponent {
  authService: AuthService = inject(AuthService);



  imageChangedEvent: any = '';
  croppedImage: any = '';

  constructor(public dialog: MatDialog,
    private sanitizer: DomSanitizer,  private dialogRef: MatDialogRef<DialogUploadNewPictureComponent>
  ) {
  }

  setUploadedToFalse() {
    this.isUploaded = false
  }
  fileChangeEvent(event: any): void {

    this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
    if (event.objectUrl) {
      this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(event.objectUrl);

      // event.blob can be used to upload the cropped image
    }
  }
  imageLoaded(image: LoadedImage) {
    // show cropper
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }

  storage = getStorage();
  randomPath = Math.random().toString(36).substring(2);
  storageRef = ref(this.storage, this.randomPath);
  isUploading: boolean = false;
  isUploaded: boolean = false;

  openChooseImg() {
    this.dialog.open(DialogChangeProfilpicComponent, { position: { right: '24px', top: '80px' }, panelClass: ['dialog-bor-rad-corner', 'user-profil-menu'] });
  }

  closeUploadImg(){
    this.dialog.closeAll()
  }

  upload() {
    fetch(this.croppedImage.changingThisBreaksApplicationSecurity)
      .then(response => response.blob())
      .then(blob => {
        this.isUploading = true;
        uploadBytes(this.storageRef, blob).then((snapshot) => {
          this.isUploading = false;
          this.isUploaded = true;
          // Zuweisung der photoURL-Eigenschaft nach Abschluss des Uploads
          getDownloadURL(snapshot.ref).then((downloadURL) => {
            this.authService.updatePicture(downloadURL)
            this.dialogRef.close();
          });
        }).catch((error) => {
          console.error("Fehler beim Hochladen des Bildes:", error);
          this.isUploading = false;
          this.isUploaded = true;
        });
      })
      .catch(error => {
        console.error("Fehler beim Extrahieren des Blobs:", error);
        this.isUploading = false;
        this.isUploaded = true;
      });
  }
}
