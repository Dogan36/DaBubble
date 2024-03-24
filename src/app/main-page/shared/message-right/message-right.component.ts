import { Component } from '@angular/core';

@Component({
  selector: 'app-message-right',
  standalone: true,
  imports: [],
  templateUrl: './message-right.component.html',
  styleUrl: './message-right.component.scss'
})
export class MessageRightComponent {

    containerHovered: boolean = false;

    onMouseOver() {
      this.containerHovered = !this.containerHovered;
    }
}

// onMouseOver() evtl auf parent componente legen