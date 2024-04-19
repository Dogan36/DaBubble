import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-message-right',
  standalone: true,
  imports: [],
  templateUrl: './message-right.component.html',
  styleUrl: './message-right.component.scss'
})
export class MessageRightComponent {

  @Input() member: string = '';
  @Input() message: string = '';
  @Input() memberImg: string = '';
  @Input() amountMessage: number = 0;
  // @Input() time: string = '';
  // @Input() timeLastMessage: string = '';
  @Input() selectedChatIndex: number = 0;

    containerHovered: boolean = false;

    onMouseOver() {
      this.containerHovered = !this.containerHovered;
    }
}

// onMouseOver() evtl auf parent componente legen