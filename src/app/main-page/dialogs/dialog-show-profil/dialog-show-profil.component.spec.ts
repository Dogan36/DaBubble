import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogShowProfilComponent } from './dialog-show-profil.component';

describe('DialogShowProfilComponent', () => {
  let component: DialogShowProfilComponent;
  let fixture: ComponentFixture<DialogShowProfilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogShowProfilComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogShowProfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
