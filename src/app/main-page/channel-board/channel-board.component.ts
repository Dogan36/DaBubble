import { Component, Renderer2, ViewChild } from '@angular/core';
import { TextareaMainPageComponent } from '../shared/textarea-main-page/textarea-main-page.component';
import { MessageLeftComponent } from '../shared/message-left/message-left.component';
import { MessageRightComponent } from '../shared/message-right/message-right.component';
import { MatDialog } from '@angular/material/dialog';
import {MatDialogModule} from '@angular/material/dialog';
import { DialogEditChannelComponent } from '../dialogs/dialog-edit-channel/dialog-edit-channel.component';
import { ChannelService } from '../../services/channel.service';
import { CommonModule } from '@angular/common';
import { WorkspaceUserProfilComponent } from '../shared/workspace-user-profil/workspace-user-profil.component';
import { UserService } from '../../services/user.service';
import { SearchMemberInputComponent } from '../shared/search-member-input/search-member-input.component';
import { Channel } from '../../models/channel.class';
import { User } from '../../models/user.class';


@Component({
  selector: 'app-channel-board',
  standalone: true,
  imports: [TextareaMainPageComponent, MessageLeftComponent, MessageRightComponent, MatDialogModule, CommonModule, WorkspaceUserProfilComponent, SearchMemberInputComponent],
  templateUrl: './channel-board.component.html',
  styleUrl: './channel-board.component.scss'
})
export class ChannelBoardComponent {

    @ViewChild(SearchMemberInputComponent) searchMembersComponent?: SearchMemberInputComponent;

    channelBoard = true;
    private bodyClickListener?: () => void;
    channelData = this.channelService.channels[this.channelService.selectedChannel];
    chatsData = this.channelService.selectedChannelChats;
    
    

    constructor(public dialog: MatDialog, public channelService: ChannelService, private renderer: Renderer2, public userService: UserService) {}

 

    openEditChannelDialog() {
      this.dialog.open(DialogEditChannelComponent, {panelClass: 'dialog-bor-rad-round'});
    }


    openChannelMembersDialog(selDialog:string) {
      let dialog = <HTMLDialogElement>document.getElementById(selDialog);
      if(dialog) {
        let wrapper = document.getElementById("dialog-wrapper");
        if(wrapper) {
          dialog.style.left = (wrapper.offsetLeft - 328) + "px"; 
          dialog.style.top = (wrapper.offsetTop + wrapper.offsetHeight + 140) + "px";
          dialog.showModal();
        } 
      }
      setTimeout(() => {
        this.closeDialogOnClickDok(dialog);
      }, 100);
    }


    closeDialogOnClickDok(dialog:HTMLDialogElement) {
        this.bodyClickListener = this.renderer.listen(document.body, 'click', (event) => {
        const dialogDimensions = dialog.getBoundingClientRect()
        if (
          event.clientX < dialogDimensions.left ||
          event.clientX > dialogDimensions.right ||
          event.clientY < dialogDimensions.top ||
          event.clientY > dialogDimensions.bottom
        ) {
          dialog.close();
          if(this.bodyClickListener) {
            this.bodyClickListener();
          }
        }
        });
    }


    closeDialog(selDialog:string) {
      let dialog = <HTMLDialogElement>document.getElementById(selDialog);
      dialog.close();

      if(this.bodyClickListener) {
        this.bodyClickListener();
      }
    }


    addMembersToChannel() {
      let selectedMembersArray = this.searchMembersComponent?.selectedMembers;
      let channel = Object.assign({}, this.channelService.channels[this.channelService.selectedChannel]);

      if(selectedMembersArray) {
        for (let i = 0; i < selectedMembersArray.length; i++) {
          const selectedMember = selectedMembersArray[i];
          if(!this.checkIfUserIsAleadyAdded(selectedMember, channel))
          channel.members.push(selectedMember.id);
        }
          this.channelService.updateChannel(channel);
      }
      if(this.searchMembersComponent) {
        this.searchMembersComponent.selectedMembers = [];
      }
        this.closeDialog('dialog-add-members');
    }


    checkIfUserIsAleadyAdded(userObj:User, channel:Channel) {
        if(channel.members.indexOf(userObj.id) >= 0) {
          return true
        } else {
          return false
        }
    }
}

