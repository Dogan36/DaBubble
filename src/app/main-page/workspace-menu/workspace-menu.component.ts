import { Component, Output, EventEmitter } from '@angular/core';
import { WorkspaceUserProfilComponent } from '../shared/workspace-user-profil/workspace-user-profil.component';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import {MatDialogModule} from '@angular/material/dialog';
import { DialogAddChannelComponent } from '../dialogs/dialog-add-channel/dialog-add-channel.component';

@Component({
  selector: 'app-workspace-menu',
  standalone: true,
  imports: [WorkspaceUserProfilComponent, MatDialogModule],
  templateUrl: './workspace-menu.component.html',
  styleUrl: './workspace-menu.component.scss'
})
export class WorkspaceMenuComponent {

  channelListOpen = true;
  messageListOpen = true;
  @Output() openChannel = new EventEmitter<void>();
    // So muss die Funktion mit Parameter aussehen!
    // @Output() openChannel = new EventEmitter<any>();
  @Output() openPrivateChat = new EventEmitter<void>();
  @Output() openNewChat = new EventEmitter<void>();

  constructor(public dialog: MatDialog) {}


  toggleChannelList() {
    this.channelListOpen = !this.channelListOpen;
  }

  toggleMessageList() {
    this.messageListOpen = !this.messageListOpen;
  }


  onOpenNewChat() {
    this.openNewChat.emit();
  }

  onOpenChannel() {
    this.openChannel.emit();
  }
  // So muss die Funktion mit Parameter aussehen!
  //   onOpenChannel(index:number) {
  //   this.openChannel.emit(index);
  // }

  onOpenPrivateChat() {
    this.openPrivateChat.emit();
  }


  openAddChannelDialog() {
    console.log('dialog works');
    this.dialog.open(DialogAddChannelComponent);
  }
}
