import { Component, Output, EventEmitter } from '@angular/core';
import { WorkspaceUserProfilComponent } from '../shared/workspace-user-profil/workspace-user-profil.component';

@Component({
  selector: 'app-workspace-menu',
  standalone: true,
  imports: [WorkspaceUserProfilComponent],
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

  toggleChannelList() {
    this.channelListOpen = !this.channelListOpen;
  }

  toggleMessageList() {
    this.messageListOpen = !this.messageListOpen;
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
}
