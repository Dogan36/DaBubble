import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignuppictureComponent } from './signuppicture.component';

describe('SignuppictureComponent', () => {
  let component: SignuppictureComponent;
  let fixture: ComponentFixture<SignuppictureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignuppictureComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SignuppictureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
