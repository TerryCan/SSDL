import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CandelMainComponent } from './candel-main.component';

describe('CandelMainComponent', () => {
  let component: CandelMainComponent;
  let fixture: ComponentFixture<CandelMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CandelMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandelMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
