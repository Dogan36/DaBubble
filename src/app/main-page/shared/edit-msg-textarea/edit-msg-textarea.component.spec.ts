import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMsgTextareaComponent } from './edit-msg-textarea.component';

describe('EditMsgTextareaComponent', () => {
  let component: EditMsgTextareaComponent;
  let fixture: ComponentFixture<EditMsgTextareaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditMsgTextareaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditMsgTextareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
