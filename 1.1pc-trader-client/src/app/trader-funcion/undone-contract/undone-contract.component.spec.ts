import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UndoneContractComponent } from './undone-contract.component';

describe('UndoneContractComponent', () => {
  let component: UndoneContractComponent;
  let fixture: ComponentFixture<UndoneContractComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UndoneContractComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UndoneContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
