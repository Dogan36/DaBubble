import { Component } from '@angular/core';
import { WorkspaceMenuComponent } from './workspace-menu/workspace-menu.component'; 
import { ChatBoardComponent } from './chat-board/chat-board.component';
import { ThreadBoardComponent } from './thread-board/thread-board.component';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [WorkspaceMenuComponent, ChatBoardComponent, ThreadBoardComponent],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss'
})
export class MainPageComponent {

}
