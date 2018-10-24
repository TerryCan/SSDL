import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CandelVolComponent } from './candel-vol.component';

describe('CandelVolComponent', () => {
  let component: CandelVolComponent;
  let fixture: ComponentFixture<CandelVolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CandelVolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandelVolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
