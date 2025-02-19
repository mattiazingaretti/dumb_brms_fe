import { Component } from '@angular/core';
import * as d3 from 'd3';


@Component({
  selector: 'app-action-config',
  standalone: true,
  imports: [],
  templateUrl: './action-config.component.html',
  styleUrl: './action-config.component.css'
})
export class ActionConfigComponent {
  ngAfterViewInit() {
    this.createFlowchart();
  }

  private createFlowchart() {
    const data = {
      name: 'Start',
      children: [
        { name: 'Step 1', children: [{ name: 'Step 1.1' }, { name: 'Step 1.2' }] },
        { name: 'Step 2', children: [{ name: 'Step 2.1' }] },
        { name: 'End' },
      ],
    };

    const margin = { top: 20, right: 120, bottom: 20, left: 120 };
    const width = 800 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;

    const svg = d3.select('#flowchart')
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    const treeLayout = d3.tree().size([height, width]);

    const root = d3.hierarchy(data);
    treeLayout(root);

    const link = svg
        .selectAll('.link')
        .data(root.links())
        .enter()
        .append('path')
        .attr('class', 'link')
        .attr('d', d3.linkHorizontal().x((d:any) => d.y).y((d:any) => d.x))
        .style('fill', 'none')
        .style('stroke', '#555')
        .style('stroke-width', 2);

    const node = svg
        .selectAll('.node')
        .data(root.descendants())
        .enter()
        .append('g')
        .attr('class', 'node')
        .attr('transform', (d) => `translate(${d.y},${d.x})`);

    node.append('circle').attr('r', 10).style('fill', '#fff').style('stroke', '#555');

    node.append('text')
        .attr('dy', '.35em')
        .attr('x', (d) => (d.children ? -13 : 13))
        .style('text-anchor', (d) => (d.children ? 'end' : 'start'))
        .text((d) => d.data.name);
  }
}
