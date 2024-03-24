import { Component, Output, EventEmitter } from '@angular/core';
import { TextareaMainPageComponent } from '../shared/textarea-main-page/textarea-main-page.component';
import { MessageLeftComponent } from '../shared/message-left/message-left.component';
import { MessageRightComponent } from '../shared/message-right/message-right.component';

@Component({
  selector: 'app-thread-board',
  standalone: true,
  imports: [TextareaMainPageComponent, MessageLeftComponent, MessageRightComponent],
  templateUrl: './thread-board.component.html',
  styleUrl: './thread-board.component.scss'
})
export class ThreadBoardComponent {

  @Output() closeThread = new EventEmitter<void>();

  onCloseThread() {
    this.closeThread.emit();
  }
}
