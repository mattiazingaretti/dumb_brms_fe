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
import {ProjectControllerService} from "../../api/api/projectController.service";
import {ProjectDTO} from "../../api/model/projectDTO";
import {PostedResourceDTO} from "../../api/model/postedResourceDTO";
import {ProjectResponseDTO} from "../../api/model/projectResponseDTO";
import {FooterComponent} from "../../shared/footer/footer.component";


@Component({
  selector: 'app-dashboard',
  standalone: true,
    imports: [
        CommonModule,
        CtaComponent,
        MatTableModule,
        MatButton,
        MatIconButton,
        MatIcon,
        FooterComponent
    ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit{


  displayedColumns: string[] = ['id', 'name', 'lastUpdate', 'creationDate', 'actions'];
  dataSource: ProjectResponseDTO[] = []

  constructor(
      public router: Router,
      private dialog: MatDialog,
      public projectsControllerService: ProjectControllerService
  ){
  }

  ngOnInit(): void {
    this.refreshDataSource();
  }

  refreshDataSource(){
    this.projectsControllerService.getUserProjects().subscribe((res: ProjectResponseDTO[])=>{
      this.dataSource = res;
    });
  }


  onClick(element: ProjectResponseDTO){
    this.router.navigate([AppPaths.DESIGN_BOARD], {
      queryParams: {id: element.id}
    })
  }

  openAddProjDialog() {
    this.dialog.open(AddProjectDialogComponent).afterClosed().subscribe((result: { isOk: boolean, projName?: string }) => {
        if (!result.isOk) {
          console.error('Error in dialog project creation');
        }
        let payload: ProjectDTO = {
            name: result.projName
        }
        //this.dataSource.push({creationDate});
        this.projectsControllerService.addProject(payload).subscribe((res: PostedResourceDTO)=>{
            if(res.success){
              this.refreshDataSource()
            }
        })
    });
  }
}
