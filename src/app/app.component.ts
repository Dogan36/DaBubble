import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ConfirmationOverlayComponent } from './confirmation-overlay/confirmation-overlay.component';
import { OverlayService } from './services/overlay.service';
import { NgIf } from '@angular/common';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ConfirmationOverlayComponent, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'dabubble';
  overlayService: OverlayService = inject(OverlayService)
}
