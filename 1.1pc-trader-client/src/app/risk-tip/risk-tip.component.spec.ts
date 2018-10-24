import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskTipComponent } from './risk-tip.component';

describe('RiskTipComponent', () => {
  let component: RiskTipComponent;
  let fixture: ComponentFixture<RiskTipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RiskTipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskTipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
