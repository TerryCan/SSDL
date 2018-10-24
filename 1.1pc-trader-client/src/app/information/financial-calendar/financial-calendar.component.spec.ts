import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialCalendarComponent } from './financial-calendar.component';

describe('FinancialCalendarComponent', () => {
  let component: FinancialCalendarComponent;
  let fixture: ComponentFixture<FinancialCalendarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinancialCalendarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinancialCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
