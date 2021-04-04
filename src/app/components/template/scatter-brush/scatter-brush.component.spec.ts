import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScatterBrushComponent } from './scatter-brush.component';

describe('ScatterBrushComponent', () => {
  let component: ScatterBrushComponent;
  let fixture: ComponentFixture<ScatterBrushComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScatterBrushComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScatterBrushComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
