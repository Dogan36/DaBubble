import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogChangeProfilpicComponent } from './dialog-change-profilpic.component';

describe('DialogChangeProfilpicComponent', () => {
  let component: DialogChangeProfilpicComponent;
  let fixture: ComponentFixture<DialogChangeProfilpicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogChangeProfilpicComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogChangeProfilpicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
