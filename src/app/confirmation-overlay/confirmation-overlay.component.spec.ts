import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationOverlayComponent } from './confirmation-overlay.component';

describe('ConfirmationOverlayComponent', () => {
  let component: ConfirmationOverlayComponent;
  let fixture: ComponentFixture<ConfirmationOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmationOverlayComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfirmationOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
