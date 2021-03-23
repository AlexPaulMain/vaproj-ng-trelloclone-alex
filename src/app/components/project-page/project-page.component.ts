import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectModel } from 'src/app/models/project.model';
import { ProjectService } from '../../services/project.service';
import { AuthenticationService } from '../../services/authentication.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogSectionComponent } from '../dialogs/dialog-section/dialog-section.component';
import { SectionService } from 'src/app/services/section.service';
import { SectionModel } from 'src/app/models/section.model';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-project-page',
  templateUrl: './project-page.component.html',
  styleUrls: ['./project-page.component.css'],
})
export class ProjectPageComponent implements OnInit {
  id: number;
  loadProject: boolean = false;
  project: ProjectModel;
  sections: SectionModel[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private projectService: ProjectService,
    private sectionService: SectionService,
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
    this.sectionService
      .getSections(this.id)
      .subscribe((sections: SectionModel[]) => {
        this.sections = sections;
        console.log(sections);
      });
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
        console.log('Data from dialog', formData);
        //add section formData to the api
        this.sectionService
          .addSection(this.id, formData)
          .subscribe((sections: SectionModel[]) => {
            console.log('Added new section', sections);
            this.sections = sections;
          });
      }
    });
  }

  reorderSections(event: CdkDragDrop<SectionModel[]>) {
    //create copy of sections as to reference original array
    let sectionsCopy: SectionModel[] = [...this.sections];

    //move items in main sections array
    console.log(this.sections, event.previousIndex, event.currentIndex);
    moveItemInArray(this.sections, event.previousIndex, event.currentIndex);

    let followId: number;
    if (event.currentIndex > event.previousIndex) {
      followId = sectionsCopy[event.currentIndex].id;
    } else {
      if (event.currentIndex == 0) {
        console.log('should stay at 0');
        followId = 0;
      } else {
        followId = sectionsCopy[event.currentIndex - 1].id;
      }
    }

    this.sectionService
      .moveSection(
        sectionsCopy[event.previousIndex],
        sectionsCopy[event.previousIndex].id,
        followId
      )
      .subscribe((data) => {
        console.log(data);
      });
  }

  updateSections(sections: SectionModel[]) {
    this.sections = sections;
  }
}
