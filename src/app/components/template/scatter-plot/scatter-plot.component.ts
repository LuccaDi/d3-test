import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { Chart } from '../../model/charts.model';
import { Scatter } from '../../model/scatterPlot.model';
import { ApiService } from '../../service/api.service';

@Component({
  selector: 'app-scatter-plot',
  templateUrl: './scatter-plot.component.html',
  styleUrls: ['./scatter-plot.component.css'],
})
export class ScatterPlotComponent implements OnInit {
  // private data = [
  //   { Framework: 'Vue', Stars: '166443', Released: '2014' },
  //   { Framework: 'React', Stars: '150793', Released: '2013' },
  //   { Framework: 'Angular', Stars: '62342', Released: '2016' },
  //   { Framework: 'Backbone', Stars: '27647', Released: '2010' },
  //   { Framework: 'Ember', Stars: '21471', Released: '2011' },
  // ];
  data: Scatter[] = [];
  private svg: any;
  private margin = 50;
  private width = 750 - this.margin * 2;
  private height = 400 - this.margin * 2;

  constructor(private apiService: ApiService) {}

  async ngOnInit(): Promise<void> {
    this.data = await this.apiService.readScatter().toPromise();
    console.log(this.data);
    this.createSvg();
    this.drawPlot();
  }

  private createSvg(): void {
    this.svg = d3
      .select('figure#scatterPlot')
      .append('svg')
      .attr('width', this.width + this.margin * 2)
      .attr('height', this.height + this.margin * 2)
      .append('g')
      .attr('transform', 'translate(' + this.margin + ',' + this.margin + ')');
  }

  private drawPlot(): void {
    // Add X axis
    const x = d3.scaleLinear().domain([-1, 10]).range([0, this.width]);
    this.svg
      .append('g')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(d3.axisBottom(x).tickFormat(d3.format('d')));

    // Add Y axis
    const y = d3.scaleLinear().domain([-1, 10]).range([this.height, 0]);
    this.svg.append('g').call(d3.axisLeft(y));

    // Add dots
    const dots = this.svg.append('g');
    dots
      .selectAll('dot')
      .data(this.data)
      .enter()
      .append('circle')
      .attr('cx', (d: any) => x(d.cRocha))
      .attr('cy', (d: any) => y(d.nkrg1))
      .attr('r', 7)
      .style('opacity', 0.5)
      .style('fill', '#FFFFFF');

    // Add labels
    dots
      .selectAll('text')
      .data(this.data)
      .enter()
      .append('text')
      .text((d: any) => d.id)
      .attr('x', (d: any) => x(d.cRocha))
      .attr('y', (d: any) => y(d.nkrg1));
  }
}
