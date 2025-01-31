import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { Component, OnInit } from '@angular/core';
import { CtaComponent } from '../../shared/cta/cta.component';
import { Router } from '@angular/router';
import { AppPaths } from '../../app.routes';
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatDialog} from "@angular/material/dialog";
import {AddProjectDialogComponent} from "../../shared/dialogs/add-project-dialog/add-project-dialog.component";


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
    MatTableModule,
    MatButton,
    MatIconButton,
    MatIcon
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit{


  displayedColumns: string[] = ['idProject', 'projectName', 'lastUpdate', 'creationDate', 'actions'];
  dataSource: ProjectData[] = []

  constructor(
      public router: Router,
      private dialog: MatDialog
  ){
    this.dataSource = MOCK_DATA
  }

  ngOnInit(): void {
  
  }



  onClick(element: any){
    this.router.navigate([AppPaths.DESIGN_BOARD], {
      queryParams: {id: element.idProject}
    })
  }

  openAddProjDialog() {
    this.dialog.open(AddProjectDialogComponent).afterClosed().subscribe((result: { isOk: boolean, projName: string }) => {
        if (!result.isOk) {
          console.error('Error in dialog project creation');
        }

        //this.dataSource.push({creationDate});

    });
  }
}
