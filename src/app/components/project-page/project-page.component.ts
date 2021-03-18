import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectModel } from 'src/app/models/project.model';
import { ProjectService } from '../../services/project.service';
import { AuthenticationService } from '../../services/authentication.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogSectionComponent } from '../dialogs/dialog-section/dialog-section.component';

@Component({
  selector: 'app-project-page',
  templateUrl: './project-page.component.html',
  styleUrls: ['./project-page.component.css'],
})
export class ProjectPageComponent implements OnInit {
  id: number;
  loadProject: boolean = false;
  project: ProjectModel;

  constructor(
    private activatedRoute: ActivatedRoute,
    private projectService: ProjectService,
    private authenticationService: AuthenticationService,
    private dialog: MatDialog
  ) {
    activatedRoute.params.subscribe((params) => {
      this.id = params['id'];
    });
  }

  ngOnInit(): void {
    this.getProject(this.id);
    this.authenticationService.startInterval();
    this.authenticationService.startTokenRefresh();
  }

  getProject(id: number) {
    this.projectService.getProject(id).subscribe((project: ProjectModel) => {
      this.project = project;
      this.loadProject = true;
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogSectionComponent);
    dialogRef.afterClosed().subscribe((formData) => {
      if (formData != 'false') {
        console.log(formData);
        //add section formData to the api
      }
    });
  }
}
