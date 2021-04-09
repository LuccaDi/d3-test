import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskCurveBrushComponent } from './risk-curve-brush.component';

describe('RiskCurveBrushComponent', () => {
  let component: RiskCurveBrushComponent;
  let fixture: ComponentFixture<RiskCurveBrushComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiskCurveBrushComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskCurveBrushComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
