import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EchartsDrawComponent } from './echarts-draw.component';

describe('EchartsDrawComponent', () => {
  let component: EchartsDrawComponent;
  let fixture: ComponentFixture<EchartsDrawComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EchartsDrawComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EchartsDrawComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
