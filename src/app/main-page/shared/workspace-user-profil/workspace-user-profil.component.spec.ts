import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkspaceUserProfilComponent } from './workspace-user-profil.component';

describe('WorkspaceUserProfilComponent', () => {
  let component: WorkspaceUserProfilComponent;
  let fixture: ComponentFixture<WorkspaceUserProfilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkspaceUserProfilComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WorkspaceUserProfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
