import { Component } from '@angular/core';
import { TextareaMainPageComponent } from '../shared/textarea-main-page/textarea-main-page.component';
import { WorkspaceUserProfilComponent } from '../shared/workspace-user-profil/workspace-user-profil.component';
import { MatDialog } from '@angular/material/dialog';
import {MatDialogModule} from '@angular/material/dialog';
import { DialogShowProfilComponent } from '../dialogs/dialog-show-profil/dialog-show-profil.component';

@Component({
  selector: 'app-chat-board',
  standalone: true,
  imports: [TextareaMainPageComponent, WorkspaceUserProfilComponent, MatDialogModule],
  templateUrl: './chat-board.component.html',
  styleUrl: './chat-board.component.scss'
})
export class ChatBoardComponent {
  channelBoard = false;

  constructor(public dialog: MatDialog) {}


  openShowProfilDialog() {
    this.dialog.open(DialogShowProfilComponent, {panelClass: 'dialog-bor-rad-round'});
  }

}
