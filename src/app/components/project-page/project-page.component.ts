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
import { BackgroundService } from 'src/app/services/background.service';

@Component({
  selector: 'app-project-page',
  templateUrl: './project-page.component.html',
  styleUrls: ['./project-page.component.css'],
})
export class ProjectPageComponent implements OnInit {
  id: number;
  loadProject = false;
  project: ProjectModel;
  sections: SectionModel[];
  backgroundClass: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private projectService: ProjectService,
    private sectionService: SectionService,
    private authenticationService: AuthenticationService,
    private dialog: MatDialog,
    private backgroundService: BackgroundService
  ) {
    activatedRoute.params.subscribe((params) => {
      this.id = params.id;
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
    this.backgroundService.getBackground().subscribe((value) => {
      this.backgroundClass = value;
    });
  }

  /**
   * Make api call from project service to retrieve project data
   * @param id project id of type number
   */
  getProject(id: number): void {
    this.projectService.getProject(id).subscribe((project: ProjectModel) => {
      this.project = project;
      this.loadProject = true;
    });
  }

  /**
   * Opens section dialog and adds section to database if section data is
   * provided and submitted
   */
  openDialog(): void {
    const dialogRef = this.dialog.open(DialogSectionComponent);
    dialogRef.afterClosed().subscribe((formData) => {
      if (formData !== 'false' && formData !== undefined) {
        console.log('Data from dialog', formData);

        // determine section position in list
        let sectionPos: number;
        if (this.sections.length === 0) {
          sectionPos = 0;
        } else {
          sectionPos =
            this.sections[this.sections.length - 1].section_order + 1;
        }
        formData = { ...formData, ...{ section_order: sectionPos } };

        // add section formData to the api
        this.sectionService
          .addSection(this.id, formData)
          .subscribe((sections: SectionModel[]) => {
            console.log('Added new section', sections);
            this.sections = sections;
          });
      }
    });
  }

  /**
   * Updates section position based on drag event positionings
   * @param event CdkDragDrop of type SectionModel[]
   */
  reorderSections(event: CdkDragDrop<SectionModel[]>): void {
    // create copy of sections as to reference original array
    const sectionsCopy: SectionModel[] = [...this.sections];

    // move items in main sections array
    console.log(this.sections, event.previousIndex, event.currentIndex);
    moveItemInArray(this.sections, event.previousIndex, event.currentIndex);

    let followId: number;
    if (event.currentIndex > event.previousIndex) {
      followId = sectionsCopy[event.currentIndex].id;
    } else {
      if (event.currentIndex === 0) {
        console.log('should stay at 0');
        followId = 0;
      } else {
        followId = sectionsCopy[event.currentIndex - 1].id;
      }
    }

    // api call to update section position
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

  /**
   * Sets sections array to given array of sections
   * @param sections sections array of type SectionModel[]
   */
  updateSections(sections: SectionModel[]): void {
    this.sections = sections;
  }
}
