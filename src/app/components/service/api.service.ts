import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Chart } from '../model/charts.model';
import { ScatterMatrix } from '../model/scatterMatrix.model';
import { ScatterZoom } from '../model/scatterZoom.model';
import { Scatter } from '../model/scatterPlot.model';
import { ScatterBrush } from '../model/scatterBrush.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  baseURL = 'https://run.mocky.io/v3/e44e4dca-5e0c-435e-b3d0-245d955dde21';

  scatterPlotURL =
    'https://run.mocky.io/v3/6626f4f7-0245-4134-b89a-2ee2a8bea1bc';

  // scatterZoomURL =
  //   'https://run.mocky.io/v3/1de434b8-ebd4-4ef1-92d2-a2afcc09f91b';

  scatterZoomURL =
    'https://run.mocky.io/v3/be9b66e4-eade-4a9e-85eb-d4f7d2038f62';

  scatterMatrixURL =
    'https://run.mocky.io/v3/c6bef917-48a1-48d9-9565-5c0fea538d43';

  scatterBrushURL =
    'https://run.mocky.io/v3/c6bef917-48a1-48d9-9565-5c0fea538d43';

  constructor(private http: HttpClient) {}

  read(): Observable<Chart[]> {
    return this.http.get<Chart[]>(this.baseURL);
  }

  readScatter(): Observable<Scatter[]> {
    return this.http.get<Scatter[]>(this.scatterPlotURL);
  }

  readScatterZoom(): Observable<ScatterZoom[]> {
    return this.http.get<ScatterZoom[]>(this.scatterZoomURL);
  }

  readScatterMatrix(): Observable<ScatterMatrix[]> {
    return this.http.get<ScatterMatrix[]>(this.scatterMatrixURL);
  }

  readScatterBrush(): Observable<ScatterBrush[]> {
    return this.http.get<ScatterBrush[]>(this.scatterBrushURL);
  }
}
