import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccesssigninComponent } from './successsignin.component';

describe('SuccesssigninComponent', () => {
  let component: SuccesssigninComponent;
  let fixture: ComponentFixture<SuccesssigninComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuccesssigninComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuccesssigninComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
