import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Sectionv2Component } from './sectionv2.component';

describe('Sectionv2Component', () => {
  let component: Sectionv2Component;
  let fixture: ComponentFixture<Sectionv2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Sectionv2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Sectionv2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
