import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScatterMatrixComponent } from './scatter-matrix.component';

describe('ScatterMatrixComponent', () => {
  let component: ScatterMatrixComponent;
  let fixture: ComponentFixture<ScatterMatrixComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScatterMatrixComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScatterMatrixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
