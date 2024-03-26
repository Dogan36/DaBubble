import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelBoardComponent } from './channel-board.component';

describe('ChannelBoardComponent', () => {
  let component: ChannelBoardComponent;
  let fixture: ComponentFixture<ChannelBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChannelBoardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChannelBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
