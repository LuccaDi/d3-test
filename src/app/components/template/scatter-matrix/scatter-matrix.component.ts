import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { csvParseRows, selectAll } from 'd3';
import { ScatterMatrix } from '../../model/scatterMatrix.model';
import { ApiService } from '../../service/api.service';

@Component({
  selector: 'app-scatter-matrix',
  templateUrl: './scatter-matrix.component.html',
  styleUrls: ['./scatter-matrix.component.css'],
})
export class ScatterMatrixComponent implements OnInit {
  private data: ScatterMatrix[] = [];
  private svg: any;
  private cell: any;
  private margin = 40;
  private width = 800 - this.margin * 2;
  private height = 800 - this.margin * 2;

  private columns = 2;
  private rows = 2;
  private numCharts = 4;

  private eixosX = ['cRocha', 'cRocha', 'cRocha', 'cRocha'];
  private eixosY = ['nkrg1', 'nkrog1', 'nkrg1', 'nkrog1'];

  private x: any = [];
  private y: any = [];

  private size =
    (this.width - (this.columns + 1) * this.margin) / this.columns +
    this.margin;

  constructor(private apiService: ApiService) {}

  async ngOnInit(): Promise<void> {
    this.data = await this.apiService.readScatterMatrix().toPromise();
    this.drawPlot();
    this.addDots();
  }

  private drawPlot(): void {
    // const symbol = d3.symbol();

    // const zoom: any = d3
    //   .zoom()
    //   .scaleExtent([0.5, 5])
    //   .translateExtent([
    //     [0, 0],
    //     [this.width, this.height],
    //   ])
    //   .on('zoom', zoomed);

    this.svg = d3
      .select('figure#scatterMatrix')
      .append('svg')
      .attr('width', this.width + this.margin * 2)
      .attr('height', this.height + this.margin * 2)
      .append('g')
      .attr('transform', 'translate(' + this.margin + ',' + this.margin + ')')
      .attr('class', 'content');
    // .call(zoom);

    // svg.append('rect').attr('width', this.width).attr('height', this.height);

    // const x: any = this.eixosX.map((c: any) => {
    //   const extent: any = d3.extent(this.data, (d: any) => d[c]);
    //   console.log(extent);
    //   d3.scaleLinear()
    //     .domain(extent)
    //     .rangeRound([this.margin / 2, this.size - this.margin / 2]);
    // });

    // this.x = d3
    //   .scaleLinear()
    //   .domain([0, 10])
    //   .rangeRound([this.margin / 2, this.size - this.margin / 2]);

    for (let u = 0; u < this.eixosX.length; u++) {
      this.x[u] = d3
        .scaleLinear()
        .domain([0, 10])
        .rangeRound([this.margin / 2, this.size - this.margin / 2]);
    }

    // const xAxis: any = d3
    //   .axisBottom(this.x)
    //   .ticks(12)
    //   .tickSize(-this.size + this.margin);

    //   const xAxis: any = () =>
    //   {
    //     const axis: any =
    //     d3
    //     .axisBottom()
    //     .ticks(12)
    //     .tickSize(-this.size + this.margin);
    // }

    this.svg.append('g').attr('class', 'x-axis');
    // this.addX(xAxis);
    this.addX();

    for (let u = 0; u < this.eixosY.length; u++) {
      this.y[u] = d3
        .scaleLinear()
        .domain([0, 10])
        .range([this.size - this.margin / 2, this.margin / 2]);
    }

    // this.y = d3
    //   .scaleLinear()
    //   .domain([0, 10])
    //   .range([this.size - this.margin / 2, this.margin / 2]);

    // const yAxis: any = d3
    //   .axisLeft(this.y)
    //   .ticks(12)
    //   .tickSize(-this.size + this.margin);

    this.svg.append('g').attr('class', 'y-axis');
    this.addY();

    this.cell = this.svg
      .append('g')
      .attr('class', 'cell')
      .selectAll('g')
      .data(d3.cross(d3.range(this.columns), d3.range(this.rows)))
      .join('g')
      .attr(
        'transform',
        ([i, j]: any) =>
          'translate(' + i * this.size + ',' + j * this.size + ')'
      );

    this.cell
      .append('rect')
      .attr('fill', 'none')
      .attr('stroke', '#aaa')
      .attr('x', this.margin / 2)
      .attr('y', this.margin / 2)
      .attr('width', this.size - this.margin)
      .attr('height', this.size - this.margin);

    // this.addDots(x, y);

    // function zoomed({ transform }: any) {
    //   // const zoomState = zoomTransform(svg.node());
    //   const newXScale = transform.rescaleX(x).interpolate(d3.interpolateRound);
    //   const newYScale = transform.rescaleY(y).interpolate(d3.interpolateRound);
    //   createX.call(xAxis.scale(newXScale));
    //   createY.call(yAxis.scale(newYScale));

    //   dots.attr('transform', transform);

    //   selectAll('.dot').attr('d', symbol.size(100 / transform.k));
    // }

    // Add labels
    // dots
    //   .selectAll('text')
    //   .data(this.data)
    //   .enter()
    //   .append('text')
    //   .text((d: any) => d.id)
    //   .attr('x', (d: any) => x(d.cRocha))
    //   .attr('y', (d: any) => y(d.nkrg1));
  }

  private addDots(): any {
    const symbol = d3.symbol();

    let cont = -1;

    this.cell
      .selectAll('path')
      .data(this.data)
      .join('path')
      .attr(
        'd',
        symbol
          .type((d: any) => {
            if (d.predefined == true) {
              return d3.symbolSquare;
            } else if (d.rm == true) {
              return d3.symbolDiamond;
            } else {
              return d3.symbolCircle;
            }
          })
          .size(50)
      )
      .attr('transform', (d: any, i: any) => {
        if (i == 0) {
          cont++;
        }

        return (
          'translate(' +
          (this.x[cont](d[this.eixosX[cont]]) + 0.5) +
          ',' +
          this.y[cont](d[this.eixosY[cont]]) +
          ')'
        );
      })
      .attr('fill', (d: any) => {
        if (d.predefined == true) {
          return 'red';
        } else if (d.rm == true) {
          return 'green';
        } else {
          return 'blue';
        }
      });
  }

  // private addX(xAxis: any) {
  //   let charts = 1;
  //   for (let i = 0; i < this.columns; i++) {
  //     for (let j = 1; j <= this.rows; j++) {
  //       if (charts > this.numCharts) {
  //         return;
  //       }
  //       selectAll('.x-axis')
  //         .append('g')
  //         .attr(
  //           'transform',
  //           'translate(' +
  //             i * this.size +
  //             ',' +
  //             (this.size * j - this.margin / 2) +
  //             ')'
  //         )
  //         .call(xAxis);

  //       charts++;
  //     }
  //   }
  // }

  private addX() {
    let charts = 0;

    const xAxis = d3
      .axisBottom(this.x[charts])
      .ticks(12)
      .tickSize(-this.size + this.margin);

    for (let i = 0; i < this.columns; i++) {
      for (let j = 1; j <= this.rows; j++) {
        if (charts >= this.numCharts) {
          return;
        }
        selectAll('.x-axis')
          .append('g')
          .attr(
            'transform',
            'translate(' +
              i * this.size +
              ',' +
              (this.size * j - this.margin / 2) +
              ')'
          )
          .call(xAxis)
          .call((g) => g.select('.domain').remove())
          .call((g) => g.selectAll('.tick line').attr('stroke', '#ddd'));

        charts++;
      }
    }
  }

  // private addX(x: any) {
  //   let charts = 1;
  //   for (let i = 0; i < this.columns; i++) {
  //     for (let j = 1; j <= this.rows; j++) {
  //       // if (charts > this.numCharts) {
  //       //   return;
  //       // }
  //       selectAll('.x-axis')
  //         .data(x)
  //         .append('g')
  //         .attr(
  //           'transform',
  //           'translate(' +
  //             i * this.size +
  //             ',' +
  //             (this.size * j - this.margin / 2) +
  //             ')'
  //         )
  //         .each(function (d: any) {
  //           // return d3.select(this).call(xAxis.scale(d));
  //           d3.axisBottom(d)
  //           .ticks(12)
  //           .tickSize(-340 + 20);
  //         });
  //       // .call(xAxis.scale((d: any) => d));

  //       // charts++;
  //     }
  //   }
  // }

  private addY() {
    let charts = 0;

    const yAxis: any = d3
      .axisLeft(this.y[charts])
      .ticks(12)
      .tickSize(-this.size + this.margin);

    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        if (charts >= this.numCharts) {
          return;
        }
        selectAll('.y-axis')
          .append('g')
          .attr(
            'transform',
            'translate(' +
              (this.margin / 2 + this.size * j) +
              ',' +
              i * this.size +
              ')'
          )
          .call(yAxis)
          .call((g) => g.select('.domain').remove())
          .call((g) => g.selectAll('.tick line').attr('stroke', '#ddd'));

        charts++;
      }
    }
  }

  // private addY(yAxis: any) {
  //   for (let i = 0; i < this.rows; i++) {
  //     for (let j = 0; j < this.columns; j++) {
  //       selectAll('.y-axis')
  //         .append('g')
  //         .attr(
  //           'transform',
  //           'translate(' +
  //             (this.margin / 2 + this.size * j) +
  //             ',' +
  //             i * this.size +
  //             ')'
  //         )
  //         .call(yAxis);
  //     }
  //   }
  // }
}
