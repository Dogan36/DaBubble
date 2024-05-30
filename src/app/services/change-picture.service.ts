import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { DialogUploadNewPictureComponent } from '../main-page/dialogs/dialog-upload-new-picture/dialog-upload-new-picture.component';
import { MatDialog } from '@angular/material/dialog';
@Injectable({
  providedIn: 'root'
})
export class ChangePictureService {

  constructor(public authService: AuthService, public dialog:MatDialog) { }
  currentPicture: string  = this.authService.currentUser.photoURL
  selectedPicture: string =''
  pictureSelected: boolean = false
  pictures = [
    "./../../../assets/img/profils/avatar_1.svg",
    "./../../../assets/img/profils/avatar_2.svg",
    "./../../../assets/img/profils/avatar_3.svg",
    "./../../../assets/img/profils/avatar_4.svg",
    "./../../../assets/img/profils/avatar_5.svg",
    "./../../../assets/img/profils/avatar_6.svg"];

 

  selectPicture(i: string) {
    this.currentPicture = i
  }

  safeSelectedPicture() {
this.selectedPicture = this.currentPicture
  }
 
  toggleOwnPicture() {
    this.dialog.open(DialogUploadNewPictureComponent, { position: { right: '24px', top: '80px' }, panelClass: ['dialog-bor-rad-corner', 'user-profil-menu'] });
  }
}

