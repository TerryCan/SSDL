import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EchartLoadingComponent } from './echart-loading.component';

describe('EchartLoadingComponent', () => {
  let component: EchartLoadingComponent;
  let fixture: ComponentFixture<EchartLoadingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EchartLoadingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EchartLoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
