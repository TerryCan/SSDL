import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LineVolComponent } from './line-vol.component';

describe('LineVolComponent', () => {
  let component: LineVolComponent;
  let fixture: ComponentFixture<LineVolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LineVolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LineVolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
