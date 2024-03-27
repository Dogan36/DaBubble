import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ChannelBoardComponent } from '../../channel-board/channel-board.component';
import { EventService } from '../../../services/event.service';

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


  constructor(private evtSvc: EventService) {}


  onMouseOver() {
    this.containerHovered = !this.containerHovered;
  }


  onOpenThread() {
    this.evtSvc.openThread();
  }
}

// onMouseOver() evtl auf parent componente legen