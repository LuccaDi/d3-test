import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScatterZoomComponent } from './scatter-zoom.component';

describe('ScatterZoomComponent', () => {
  let component: ScatterZoomComponent;
  let fixture: ComponentFixture<ScatterZoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScatterZoomComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScatterZoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
