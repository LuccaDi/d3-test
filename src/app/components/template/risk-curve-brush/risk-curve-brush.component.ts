import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { RiskCurveBrush } from '../../model/riskCurveBrush.model';
import { ApiService } from '../../service/api.service';

@Component({
  selector: 'app-risk-curve-brush',
  templateUrl: './risk-curve-brush.component.html',
  styleUrls: ['./risk-curve-brush.component.css'],
})
export class RiskCurveBrushComponent implements OnInit {
  private data: RiskCurveBrush[] = [];
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

  private newXScale: any;
  private newYScale: any;

  private xAxis: any;
  private yAxis: any;

  private tempGx: any;
  private tempGy: any;

  private def: any;

  private size =
    (this.width - (this.columns + 1) * this.margin) / this.columns +
    this.margin;

  constructor(private apiService: ApiService) {}

  async ngOnInit(): Promise<void> {
    this.data = await this.apiService.readRiskCurveBrush().toPromise();

    this.drawPlot();
    this.addDots();
  }

  private drawPlot(): void {
    // const symbol = d3.symbol();

    this.svg = d3
      .select('figure#riskCurveBrush')
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

    this.newXScale = this.x;

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

    this.newYScale = this.y;

    this.tempGy = this.svg.append('g').attr('class', 'y-axis');
    this.addY();

    this.def = this.svg.append('defs');

    this.addClip();

    this.rects = this.svg.append('g').attr('class', 'rects');

    this.graphs = this.svg.append('g').attr('class', 'graphs');

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

  private zoomed = ({ transform }: any, id: number) => {
    this.newXScale = transform
      .rescaleX(this.x)
      .interpolate(d3.interpolateRound);
    this.newYScale = transform
      .rescaleY(this.y)
      .interpolate(d3.interpolateRound);

    this.tempGx.select('.x' + id).call(this.xAxis.scale(this.newXScale));
    this.tempGy.select('.y' + id).call(this.yAxis.scale(this.newYScale));

    // console.log(newXScale.domain()[0]);

    this.graphs.select('#graph' + id).attr('transform', ([i, j]: any) => {
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

    d3.select('#graph' + id)
      .selectAll('.dot')
      .attr('d', this.symbol.size(50 / transform.k));

    this.def
      .select('#clip' + id)
      .select('rect')
      .attr('transform', 'scale(' + 1 / transform.k + ')')
      .attr('x', this.margin / 2 - transform.x)
      .attr('y', this.margin / 2 - transform.y);

    d3.select('#graph' + id)
      .select('#x')
      .style('stroke-width', 1.5 / transform.k)
      .attr('y1', (this.size - this.margin / 2 - transform.y) / transform.k) // y position of the first end of the line
      .attr('y2', (this.margin / 2 - transform.y) / transform.k); // y position of the second end of the line

    d3.select('#graph' + id)
      .select('#y')
      .style('stroke-width', 1.5 / transform.k)
      .attr('x1', (this.margin / 2 - transform.x) / transform.k) // y position of the first end of the line
      .attr('x2', (this.size - this.margin / 2 - transform.x) / transform.k); // y position of the second end of the line
  };

  private addClip() {
    let charts = 0;

    for (let i = 0; i < this.columns; i++) {
      for (let j = 0; j < this.rows; j++) {
        if (charts >= this.numCharts) {
          return;
        }

        this.def
          .append('clipPath')
          .attr('id', 'clip' + charts)
          .append('rect')
          .attr('x', this.margin / 2)
          .attr('y', this.margin / 2)
          .attr('width', this.size - this.margin)
          .attr('height', this.size - this.margin);

        charts++;
      }
    }
  }

  private addRect() {
    let i = 0;

    let id: number;

    const zoom: any = d3
      .zoom()
      .scaleExtent([0.5, 5])
      // .translateExtent([
      //   [0, 0],
      //   [this.width, this.height],
      // ])
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
      // .on('click', function (d: any) {

      //   console.log(d);
      // })
      // .on('wheel', function (d: any) {
      //   id = d.srcElement.id;
      // })
      .call(zoom);
  }

  private addDots() {
    let cont = -1;
    let g = 0;
    let c = 0;
    let nameX = 0;
    let nameY = 0;

    let contador = 0;

    let style;
    let matrix;

    this.graphs
      .selectAll('g')
      .attr('id', () => 'graph' + g++)
      .attr('clip-path', () => `url(#clip${c++})`)
      .attr('nameX', () => this.eixosX[nameX++])
      .attr('nameY', () => this.eixosY[nameY++])
      .selectAll('path')
      .data(this.data)
      .join('path')
      .attr('id', (d: any) => d.id)
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
          this.x(d[this.eixosX[cont]]) +
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
      })
      .on('click', (d: any) => {
        let graphSelectX = 0;
        let graphSelectY = 0;

        let x;
        let y;
        let rg = d.srcElement.attributes.id.value;

        this.data.map((dada: any) => {
          if (dada.id == rg) {
            this.graphs
              // .select('#' + d.path[1].id)
              .selectAll('g')
              .selectAll('line')
              .remove();

            this.graphs
              // .select('#' + d.path[1].id)
              .selectAll('g')
              .append('line')
              .attr('id', 'x')
              .style('stroke', 'red') // colour the line
              .style('stroke-width', 1.5)
              .style('stroke-linejoin', 'round')
              .style('stroke-linecap', 'round')
              .attr('x1', () => {
                x = this.graphs.select(`#graph${graphSelectX++}`)[
                  '_groups'
                ][0][0].attributes.nameX.value;

                return this.x(dada[x]);
              }) // x position of the first end of the line
              .attr('y1', this.y(this.newYScale.domain()[0])) // y position of the first end of the line
              .attr('x2', () => {
                if (graphSelectX >= this.numCharts) {
                  graphSelectX = 0;
                }

                x = this.graphs.select(`#graph${graphSelectX++}`)[
                  '_groups'
                ][0][0].attributes.nameX.value;

                return this.x(dada[x]);
              }) // x position of the second end of the line
              .attr('y2', this.y(this.newYScale.domain()[1])); // y position of the second end of the line

            this.graphs
              // .select('#' + d.path[1].id)
              .selectAll('g')
              .append('line')
              .attr('id', 'y')
              .style('stroke', 'red') // colour the line
              .style('stroke-width', 1.5)
              .style('stroke-linejoin', 'round')
              .style('stroke-linecap', 'round')
              .attr('x1', this.x(this.newXScale.domain()[0])) // x position of the first end of the line
              .attr('y1', () => {
                y = this.graphs.select(`#graph${graphSelectY++}`)[
                  '_groups'
                ][0][0].attributes.nameY.value;

                return this.y(dada[y]);
              }) // y position of the first end of the line
              .attr('x2', this.x(this.newXScale.domain()[1])) // x position of the second end of the line
              .attr('y2', () => {
                if (graphSelectY >= this.numCharts) {
                  graphSelectY = 0;
                }
                y = this.graphs.select(`#graph${graphSelectY++}`)[
                  '_groups'
                ][0][0].attributes.nameY.value;

                return this.y(dada[y]);
              }); // y position of the second end of the line
          }
        });
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
