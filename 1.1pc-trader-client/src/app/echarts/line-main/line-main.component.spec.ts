import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LineMainComponent } from './line-main.component';

describe('LineMainComponent', () => {
  let component: LineMainComponent;
  let fixture: ComponentFixture<LineMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LineMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LineMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
