import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogUploadNewPictureComponent } from './dialog-upload-new-picture.component';

describe('DialogUploadNewPictureComponent', () => {
  let component: DialogUploadNewPictureComponent;
  let fixture: ComponentFixture<DialogUploadNewPictureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogUploadNewPictureComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogUploadNewPictureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
