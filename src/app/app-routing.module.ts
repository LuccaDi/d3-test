import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BarComponent } from './components/template/bar/bar.component';
import { PieComponent } from './components/template/pie/pie.component';
import { ScatterPlotComponent } from './components/template/scatter-plot/scatter-plot.component';
import { ScatterMatrixComponent } from './components/template/scatter-matrix/scatter-matrix.component';
import { ScatterZoomComponent } from './components/template/scatter-zoom/scatter-zoom.component';

const routes: Routes = [
  {
    path: 'bar',
    component: BarComponent,
  },
  {
    path: 'pie',
    component: PieComponent,
  },
  {
    path: 'scatter',
    component: ScatterPlotComponent,
  },
  {
    path: 'scatterMatrix',
    component: ScatterMatrixComponent,
  },
  {
    path: 'scatterZoom',
    component: ScatterZoomComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
