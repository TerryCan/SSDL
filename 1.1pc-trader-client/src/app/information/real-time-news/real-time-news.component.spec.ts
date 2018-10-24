import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RealTimeNewsComponent } from './real-time-news.component';

describe('RealTimeNewsComponent', () => {
  let component: RealTimeNewsComponent;
  let fixture: ComponentFixture<RealTimeNewsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RealTimeNewsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RealTimeNewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
