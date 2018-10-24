import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetSltpComponent } from './set-sltp.component';

describe('SetSltpComponent', () => {
  let component: SetSltpComponent;
  let fixture: ComponentFixture<SetSltpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetSltpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetSltpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
