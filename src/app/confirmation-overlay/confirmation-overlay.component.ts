import { Component, inject, Input  } from '@angular/core';
import { OverlayService } from '../services/overlay.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-confirmation-overlay',
  standalone: true,
  imports: [NgClass],
  templateUrl: './confirmation-overlay.component.html',
  styleUrl: './confirmation-overlay.component.scss'
})
export class ConfirmationOverlayComponent {
overlayService: OverlayService = inject(OverlayService)

}
