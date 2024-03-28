import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogUserMenuComponent } from './dialog-user-menu.component';

describe('DialogUserMenuComponent', () => {
  let component: DialogUserMenuComponent;
  let fixture: ComponentFixture<DialogUserMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogUserMenuComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogUserMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
