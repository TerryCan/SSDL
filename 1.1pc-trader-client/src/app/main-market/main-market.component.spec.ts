import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainMarketComponent } from './main-market.component';

describe('MainMarketComponent', () => {
  let component: MainMarketComponent;
  let fixture: ComponentFixture<MainMarketComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainMarketComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainMarketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
