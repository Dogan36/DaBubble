import { Component } from '@angular/core';
import { TextareaMainPageComponent } from '../shared/textarea-main-page/textarea-main-page.component';
import { WorkspaceUserProfilComponent } from '../shared/workspace-user-profil/workspace-user-profil.component';

@Component({
  selector: 'app-chat-board',
  standalone: true,
  imports: [TextareaMainPageComponent, WorkspaceUserProfilComponent],
  templateUrl: './chat-board.component.html',
  styleUrl: './chat-board.component.scss'
})
export class ChatBoardComponent {

  singleChat = true;
  newSglChat = true;

}
