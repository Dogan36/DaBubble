import { Component, Input } from '@angular/core';
import { ChannelBoardComponent } from '../../channel-board/channel-board.component';

@Component({
  selector: 'app-message-left',
  standalone: true,
  imports: [ChannelBoardComponent],
  templateUrl: './message-left.component.html',
  styleUrl: './message-left.component.scss'
})
export class MessageLeftComponent {

  @Input() onChannelBoard: boolean = false;

  containerHovered: boolean = false;

  onMouseOver() {
    this.containerHovered = !this.containerHovered;
  }
}

// onMouseOver() evtl auf parent componente legen