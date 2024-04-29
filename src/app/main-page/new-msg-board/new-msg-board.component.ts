import { Component } from '@angular/core';
import { TextareaMainPageComponent } from '../shared/textarea-main-page/textarea-main-page.component';
import { SearchInputComponent } from '../shared/search-input/search-input.component';

@Component({
  selector: 'app-new-msg-board',
  standalone: true,
  imports: [TextareaMainPageComponent, SearchInputComponent],
  templateUrl: './new-msg-board.component.html',
  styleUrl: './new-msg-board.component.scss'
})
export class NewMsgBoardComponent {

}
