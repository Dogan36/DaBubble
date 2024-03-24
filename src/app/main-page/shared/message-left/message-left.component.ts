import { Component } from '@angular/core';

@Component({
  selector: 'app-message-left',
  standalone: true,
  imports: [],
  templateUrl: './message-left.component.html',
  styleUrl: './message-left.component.scss'
})
export class MessageLeftComponent {

  containerHovered: boolean = false;

  onMouseOver() {
    this.containerHovered = !this.containerHovered;
  }
}

// onMouseOver() evtl auf parent componente legen