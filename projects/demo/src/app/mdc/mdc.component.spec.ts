import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MdcComponent } from './mdc.component';

describe('MdcComponent', () => {
  let component: MdcComponent;
  let fixture: ComponentFixture<MdcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MdcComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MdcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
