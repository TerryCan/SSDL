import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexsManageComponent } from './indexs-manage.component';

describe('IndexsManageComponent', () => {
  let component: IndexsManageComponent;
  let fixture: ComponentFixture<IndexsManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndexsManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndexsManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
