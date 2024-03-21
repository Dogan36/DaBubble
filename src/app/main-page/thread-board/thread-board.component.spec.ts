import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreadBoardComponent } from './thread-board.component';

describe('ThreadBoardComponent', () => {
  let component: ThreadBoardComponent;
  let fixture: ComponentFixture<ThreadBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThreadBoardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ThreadBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
