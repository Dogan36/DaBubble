import { Component, Input } from '@angular/core';
import { EventService } from '../../../services/event.service';
import { MatDialog } from '@angular/material/dialog';
import {MatDialogModule} from '@angular/material/dialog';
import { DialogShowProfilComponent } from '../../dialogs/dialog-show-profil/dialog-show-profil.component';
import { ChannelService } from '../../../services/channel.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-message-right',
  standalone: true,
  imports: [MatDialogModule],
  templateUrl: './message-right.component.html',
  styleUrl: './message-right.component.scss'
})
export class MessageRightComponent {

  @Input() onChannelBoard: boolean = false;
  @Input() member: string = '';
  @Input() message: string = '';
  @Input() memberImg: string = '';
  @Input() amountMessage: number = 0;
  @Input() time: string = '';
  @Input() timeLastMessage: string = '';
  @Input() selectedChatIndex: number = 0;
  @Input() memberRef: string = '';

  containerHovered: boolean = false;

  constructor(private evtSvc: EventService, public dialog: MatDialog, private channelService: ChannelService, private userService: UserService) {}

  onMouseOver() {
    this.containerHovered = !this.containerHovered;
  }


  onOpenThread(chatIndex:number) {
    this.channelService.selChatIndex = chatIndex;
    this.evtSvc.openThread();
  }


  openShowProfilDialog() {
    let memberData = this.userService.users[this.userService.getUsersData(this.memberRef)];

    this.dialog.open(DialogShowProfilComponent, {panelClass: 'dialog-bor-rad-round', data: {
        profilName: memberData.name,
        profilRef: memberData.id,
        profilEmail: memberData.email,
        profilImg: memberData.photoURL,
      }});
  }
}

// onMouseOver() evtl auf parent componente legen