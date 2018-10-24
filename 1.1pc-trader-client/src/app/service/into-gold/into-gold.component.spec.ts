import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntoGoldComponent } from './into-gold.component';

describe('IntoGoldComponent', () => {
  let component: IntoGoldComponent;
  let fixture: ComponentFixture<IntoGoldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntoGoldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntoGoldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
