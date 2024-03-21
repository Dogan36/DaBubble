import { Component } from '@angular/core';
import { WorkspaceUserProfilComponent } from '../shared/workspace-user-profil/workspace-user-profil.component';

@Component({
  selector: 'app-workspace-menu',
  standalone: true,
  imports: [WorkspaceUserProfilComponent],
  templateUrl: './workspace-menu.component.html',
  styleUrl: './workspace-menu.component.scss'
})
export class WorkspaceMenuComponent {

}
