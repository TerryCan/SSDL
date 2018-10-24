import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CandelMacdComponent } from './candel-macd.component';

describe('CandelMacdComponent', () => {
  let component: CandelMacdComponent;
  let fixture: ComponentFixture<CandelMacdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CandelMacdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandelMacdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
