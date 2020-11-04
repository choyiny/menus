import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Itemv2Component } from './itemv2.component';

describe('Itemv2Component', () => {
  let component: Itemv2Component;
  let fixture: ComponentFixture<Itemv2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Itemv2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Itemv2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
