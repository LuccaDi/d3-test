import { FocusMonitorDetectionMode } from '@angular/cdk/a11y';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { csvParseRows, selectAll, svg, zoom } from 'd3';
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
  private graphs: any;
  private rects: any;
  private margin = 40;
  private width = 800 - this.margin * 2;
  private height = 800 - this.margin * 2;

  private symbol = d3.symbol();

  private columns = 2;
  private rows = 2;
  private numCharts = 4;

  private eixosX = ['cRocha', 'cRocha', 'cRocha', 'cRocha'];
  private eixosY = ['nkrg1', 'nkrog1', 'nkrg1', 'nkrog1'];

  private x: any;
  private y: any;

  private xAxis: any;
  private yAxis: any;

  private tempGx: any;
  private tempGy: any;

  private clip: any;

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

    this.svg = d3
      .select('figure#scatterMatrix')
      .append('svg')
      .attr('width', this.width + this.margin * 2)
      .attr('height', this.height + this.margin * 2)
      .append('g')
      .attr('transform', 'translate(' + this.margin + ',' + this.margin + ')')
      .attr('class', 'content');
    // .call(zoom);

    this.x = d3
      .scaleLinear()
      .domain([0, 10])
      .rangeRound([this.margin / 2, this.size - this.margin / 2]);

    this.xAxis = d3
      .axisBottom(this.x)
      .ticks(12)
      .tickSize(-this.size + this.margin);

    this.tempGx = this.svg.append('g').attr('class', 'x-axis');

    this.addX();

    this.y = d3
      .scaleLinear()
      .domain([0, 10])
      .range([this.size - this.margin / 2, this.margin / 2]);

    this.yAxis = d3
      .axisLeft(this.y)
      .ticks(12)
      .tickSize(-this.size + this.margin);

    this.tempGy = this.svg.append('g').attr('class', 'y-axis');
    this.addY();

    this.clip = this.svg
      .append('defs')
      .append('clipPath')
      .attr('id', 'clip')
      .append('rect')
      // .attr('id', 'clip-rect' + charts)
      .attr(
        'transform',
        'translate(' + this.margin / 2 + ',' + this.margin / 2 + ')'
      )
      // .attr('x', i * this.size + this.margin / 2)
      // .attr('y', j * this.size + this.margin / 2)

      .attr('width', this.size - this.margin)
      .attr('height', this.size - this.margin);
    // this.addClip();

    this.graphs = this.svg.append('g').attr('class', 'graphs');

    this.rects = this.svg.append('g').attr('class', 'rects');

    this.graphs
      .selectAll('g')
      .data(d3.cross(d3.range(this.columns), d3.range(this.rows)))
      .join('g')
      .attr(
        'transform',
        ([i, j]: any) =>
          'translate(' + i * this.size + ',' + j * this.size + ')'
      );

    this.addRect();

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

  private zoomed = ({ transform }: any, id: string) => {
    const newXScale = transform
      .rescaleX(this.x)
      .interpolate(d3.interpolateRound);
    const newYScale = transform
      .rescaleY(this.y)
      .interpolate(d3.interpolateRound);

    this.tempGx.select('.x' + id).call(this.xAxis.scale(newXScale));
    this.tempGy.select('.y' + id).call(this.yAxis.scale(newYScale));

    this.graphs.select('.graph' + id).attr('transform', ([i, j]: any) => {
      console.log('i: ' + i);
      console.log('j: ' + j);
      return (
        'translate(' +
        (i * this.size + transform.x) +
        ',' +
        (j * this.size + transform.y) +
        ') scale(' +
        transform.k +
        ')'
      );
    });

    d3.select('.graph' + id)
      .selectAll('.dot')
      .attr('d', this.symbol.size(50 / transform.k));

    this.clip
      // .select('#clip')
      // .select('rect')
      .attr('transform', 'scale(' + 1 / transform.k + ')')
      // .attr(
      //   'transform',
      //   'translate(' +
      //     (this.margin + transform.x) +
      //     ',' +
      //     (this.margin - transform.y) +
      //     ') scale(' +
      //     1 / transform.k +
      //     ')'
      // );
      // .attr('x', ([i]: any) => i * this.size - transform.x)
      // .attr('y', ([j]: any) => j * this.size - transform.y)

      .attr('x', this.margin / 2 - transform.x)
      .attr('y', this.margin / 2 - transform.y);

    // this.clip
    //   .select('#clip' + id)
    //   .select('rect')
    //   .attr('transform', ([i, j]: any) => {
    //     return (
    //       'translate(' +
    //       (i * this.size + transform.x) +
    //       ',' +
    //       (j * this.size + transform.y) +
    //       ') scale(' +
    //       1 / transform.k +
    //       ')'
    //     );
    //   })
    //   // .attr('x', ([i]: any) => i * this.size - transform.x)
    //   // .attr('y', ([j]: any) => j * this.size - transform.y)

    //   .attr('x', this.margin / 2 - transform.x)
    //   .attr('y', this.margin / 2 - transform.y);
  };

  private addClip() {
    let charts = 0;

    for (let i = 0; i < this.columns; i++) {
      for (let j = 0; j < this.rows; j++) {
        if (charts >= this.numCharts) {
          return;
        }

        this.clip
          .append('clipPath')
          .attr('id', 'clip' + charts)
          .append('rect')
          // .attr('id', 'clip-rect' + charts)
          .attr(
            'transform',
            'translate(' +
              (i * this.size + this.margin / 2) +
              ',' +
              (j * this.size + this.margin / 2) +
              ')'
          )
          // .attr('x', i * this.size + this.margin / 2)
          // .attr('y', j * this.size + this.margin / 2)

          .attr('width', this.size - this.margin)
          .attr('height', this.size - this.margin);
        // .attr(
        //   'transform',
        //   'translate(' +
        //     i * this.size +
        //     ',' +
        //     (this.size * j - this.margin / 2) +
        //     ')'
        // );

        charts++;
      }
    }
  }

  private addRect() {
    let i = 0;

    let id = '';

    const zoom: any = d3
      .zoom()
      .scaleExtent([0.5, 5])
      .translateExtent([
        [0, 0],
        [this.width, this.height],
      ])
      .on('zoom', (transform) => this.zoomed(transform, id));

    this.rects
      .selectAll('rect')
      .data(d3.cross(d3.range(this.columns), d3.range(this.rows)))
      .join('rect')
      .attr(
        'transform',
        ([i, j]: any) =>
          'translate(' + i * this.size + ',' + j * this.size + ')'
      )
      .attr('fill', '#FFFFFF')
      .attr('fill-opacity', '0.0')
      .attr('stroke', '#aaa')
      .attr('x', this.margin / 2)
      .attr('y', this.margin / 2)
      .attr('width', this.size - this.margin)
      .attr('height', this.size - this.margin)
      .attr('id', () => i++)
      // .call(zoom);
      .on('mouseover', function (d: any) {
        id = d.srcElement.id;
      })
      // .on('wheel', function (d: any) {
      //   id = d.srcElement.id;
      // })
      .call(zoom);
  }

  private addDots() {
    let cont = -1;
    let g = 0;
    let c = -1;

    this.graphs
      .selectAll('g')
      .attr('class', () => 'graph' + g++)
      .attr('clip-path', 'url(#clip)')
      // .attr('clip-path', () => {
      //   // c++;
      //   return `url(#clip${c++})`;
      // })
      .selectAll('path')
      .data(this.data)
      .join('path')
      .attr('class', 'dot')
      .attr(
        'd',
        this.symbol
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
          (this.x(d[this.eixosX[cont]]) + 0.5) +
          ',' +
          this.y(d[this.eixosY[cont]]) +
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

  private addX() {
    let charts = 0;

    for (let i = 0; i < this.columns; i++) {
      for (let j = 1; j <= this.rows; j++) {
        if (charts >= this.numCharts) {
          return;
        }
        // selectAll('.x-axis')
        this.tempGx
          .append('g')
          .attr('class', 'x' + charts)
          .attr(
            'transform',
            'translate(' +
              i * this.size +
              ',' +
              (this.size * j - this.margin / 2) +
              ')'
          )
          .call(this.xAxis);
        // .call((g) => g.select('.domain').remove())
        // .call((g) => g.selectAll('.tick line').attr('stroke', '#ddd'));

        charts++;
      }
    }
  }

  private addY() {
    let charts = 0;

    for (let i = 0; i < this.columns; i++) {
      for (let j = 0; j < this.rows; j++) {
        if (charts >= this.numCharts) {
          return;
        }
        // selectAll('.y-axis')
        this.tempGy
          .append('g')
          .attr('class', 'y' + charts)
          .attr(
            'transform',
            'translate(' +
              (this.margin / 2 + this.size * i) +
              ',' +
              j * this.size +
              ')'
          )
          .call(this.yAxis);
        // .call((g) => g.select('.domain').remove())
        // .call((g) => g.selectAll('.tick line').attr('stroke', '#ddd'));

        charts++;
      }
    }
  }
}
