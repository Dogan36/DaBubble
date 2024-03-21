import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextareaMainPageComponent } from './textarea-main-page.component';

describe('TextareaMainPageComponent', () => {
  let component: TextareaMainPageComponent;
  let fixture: ComponentFixture<TextareaMainPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextareaMainPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TextareaMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
