import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchMemberInputComponent } from './search-member-input.component';

describe('SearchMemberInputComponent', () => {
  let component: SearchMemberInputComponent;
  let fixture: ComponentFixture<SearchMemberInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchMemberInputComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SearchMemberInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
