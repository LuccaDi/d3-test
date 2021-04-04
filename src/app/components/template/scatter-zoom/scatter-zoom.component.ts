import { style } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { selectAll, symbolSquare } from 'd3';
import { ScatterZoom } from '../../model/scatterZoom.model';
import { ApiService } from '../../service/api.service';

@Component({
  selector: 'app-scatter-zoom',
  templateUrl: './scatter-zoom.component.html',
  styleUrls: ['./scatter-zoom.component.css'],
})
export class ScatterZoomComponent implements OnInit {
  private data: ScatterZoom[] = [];
  // private svg: any;
  private margin = 20;
  private width = 750 - this.margin * 2;
  private height = 400 - this.margin * 2;

  constructor(private apiService: ApiService) {}

  async ngOnInit(): Promise<void> {
    this.data = await this.apiService.readScatterMatrix().toPromise();
    // this.createSvg();
    this.drawPlot();
  }

  // private createSvg(): void {
  //   svg = d3
  //     .select('figure#scatterMatrix')
  //     .append('svg')
  //     .attr('width', this.width + this.margin * 2)
  //     .attr('height', this.height + this.margin * 2);
  //   // .append('g')
  //   // .attr('transform', 'translate(' + this.margin + ',' + this.margin + ')');
  // }

  private drawPlot(): void {
    const zoom: any = d3
      .zoom()
      .scaleExtent([0.5, 5])
      .translateExtent([
        [0, 0],
        [this.width, this.height],
      ])
      .on('zoom', zoomed);

    const svg = d3
      .select('figure#scatterZoom')
      .append('svg')
      .attr('width', this.width + this.margin * 2)
      .attr('height', this.height + this.margin * 2)
      .append('g')
      .attr('transform', 'translate(' + this.margin + ',' + this.margin + ')')
      .attr('class', 'content')
      .call(zoom);

    svg
      .append('rect')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('fill', '#044B9466');

    // Add X axis
    const x = d3.scaleLinear().domain([-5, 10]).range([0, this.width]);

    // Add Y axis
    const y = d3.scaleLinear().domain([-5, 10]).range([this.height, 0]);

    //xAxis
    const xAxis: any = d3.axisBottom(x).ticks(12).tickSize(-this.height);

    //xAxis
    const yAxis: any = d3.axisLeft(y).ticks(12).tickSize(-this.width);

    const createX = svg
      .append('g')
      .attr('transform', 'translate(0,' + this.height + ')')
      .attr('class', 'x-axis')
      .call(xAxis);

    const createY = svg.append('g').attr('class', 'y-axis').call(yAxis);

    const clip = svg
      .append('defs')
      .append('clipPath')
      .attr('id', 'clip')
      .append('rect')
      .attr('id', 'clip-rect')
      .attr('x', '0')
      .attr('y', '0')
      .attr('width', this.width)
      .attr('height', this.height);

    // svg.call(zoom);

    var clip_orig_x = 0,
      clip_orig_y = 0;
    function zoomed({ transform }: any) {
      // const zoomState = zoomTransform(svg.node());
      let panX = transform.x;
      let panY = transform.y;
      let scale = transform.k;

      const newXScale = transform.rescaleX(x).interpolate(d3.interpolateRound);
      const newYScale = transform.rescaleY(y).interpolate(d3.interpolateRound);
      createX.call(xAxis.scale(newXScale));
      createY.call(yAxis.scale(newYScale));

      dots.attr('transform', transform);

      selectAll('.dot').attr('d', symbol.size(100 / transform.k));

      clip
        .attr('transform', 'scale(' + 1 / scale + ')')
        .attr('x', clip_orig_x - panX)
        .attr('y', clip_orig_y - panY);
    }

    // d3.select('svg')
    //   .append('defs')
    //   .append('clipPath')
    //   .attr('id', 'clip')
    //   .append('rect')
    //   .attr('width', this.width)
    //   .attr('height', this.height);

    // Add dots
    const symbol = d3.symbol();

    const dots = svg
      .append('g')
      .attr('class', 'DOTS')
      .attr('clip-path', 'url(#clip)');
    // dots
    //   // .attr('clip-path', 'url(#clip)')
    //   .selectAll('path')
    //   .data(this.data)
    //   .join('path')
    //   .attr('class', 'dot')
    //   .attr(
    //     'd',
    //     symbol
    //       .type((d: any) => {
    //         if (d.predefined == true) {
    //           return d3.symbolSquare;
    //         } else if (d.rm == true) {
    //           return d3.symbolDiamond;
    //         } else {
    //           return d3.symbolCircle;
    //         }
    //       })
    //       .size(100)
    //   )
    //   .attr(
    //     'transform',
    //     (d: any) => 'translate(' + x(d.cRocha) + ',' + y(d.nkrg1) + ')'
    //   )
    //   .attr('fill', (d: any) => {
    //     if (d.predefined == true) {
    //       return 'red';
    //     } else if (d.rm == true) {
    //       return 'green';
    //     } else {
    //       return 'blue';
    //     }
    //   });

    dots
      // .selectAll('circle')
      // .data(this.data)
      // .enter()
      // .append('circle')
      // .attr('cx', (d) => x(d.cRocha))
      // .attr('cy', (d) => y(d.nkrg1))
      // .attr('r', 5);

      .selectAll('path')
      .data(this.data)
      .join('path')
      .attr('class', 'dot')
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
          .size(100)
      )
      .attr(
        'transform',
        (d: any) => 'translate(' + x(d.cRocha) + ',' + y(d.nkrg1) + ')'
      )
      .attr('fill', (d: any) => {
        if (d.predefined == true) {
          return 'red';
        } else if (d.rm == true) {
          return 'green';
        } else {
          return 'blue';
        }
      });

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
}
