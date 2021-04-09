import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './components/template/header/header.component';

import { MatToolbarModule } from '@angular/material/toolbar';
import { BarComponent } from './components/template/bar/bar.component';
import { PieComponent } from './components/template/pie/pie.component';
import { ScatterComponent } from './components/template/scatter/scatter.component';
import { MatButtonModule } from '@angular/material/button';

import { HttpClientModule } from '@angular/common/http';
import { NavComponent } from './components/template/nav/nav.component';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { ScatterPlotComponent } from './components/template/scatter-plot/scatter-plot.component';
import { ScatterMatrixComponent } from './components/template/scatter-matrix/scatter-matrix.component';
import { ScatterZoomComponent } from './components/template/scatter-zoom/scatter-zoom.component';
import { ScatterBrushComponent } from './components/template/scatter-brush/scatter-brush.component';
import { RiskCurveBrushComponent } from './components/template/risk-curve-brush/risk-curve-brush.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    BarComponent,
    PieComponent,
    ScatterComponent,
    NavComponent,
    ScatterPlotComponent,
    ScatterMatrixComponent,
    ScatterZoomComponent,
    ScatterBrushComponent,
    RiskCurveBrushComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    HttpClientModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatCardModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
