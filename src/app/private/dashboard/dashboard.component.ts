import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { Component, OnInit } from '@angular/core';
import { CtaComponent } from '../../shared/cta/cta.component';
import { Router } from '@angular/router';
import { AppPaths } from '../../app.routes';


export interface ProjectData {
  idProject: number,
  projectName: string,
  lastUpdate: Date,
  creationDate: Date
}

const MOCK_DATA: ProjectData[] = [
  {
    idProject: 1,
    projectName: 'This is a mock project name',
    lastUpdate: new Date(),
    creationDate: new Date()
  }
];

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ 
    CommonModule,
    CtaComponent,
    MatTableModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit{


  displayedColumns: string[] = ['idProject', 'projectName', 'lastUpdate', 'creationDate', 'actions'];
  dataSource: ProjectData[] = []

  constructor(public router: Router){
    this.dataSource = MOCK_DATA
    console.log(this.dataSource)
  }

  ngOnInit(): void {
  
  }



  onClick(element: any){
    this.router.navigate([AppPaths.DESIGN_BOARD], {
      queryParams: {id: element.idProject}
    })
  }
}
