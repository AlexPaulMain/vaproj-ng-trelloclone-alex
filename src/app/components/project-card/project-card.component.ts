import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ProjectModel } from 'src/app/models/project.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DialogDeleteComponent } from '../dialogs/dialog-delete/dialog-delete.component';
import { ProjectService } from '../../services/project.service';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-project-card',
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.css'],
})
export class ProjectCardComponent implements OnInit {
  @Input() project: ProjectModel;
  edit = false;
  editProjectForm: FormGroup;
  @Output() projectsOutput = new EventEmitter<ProjectModel[]>();

  constructor(
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private projectService: ProjectService,
    private router: Router,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    // Initialise form
    this.editProjectForm = this.formBuilder.group({
      project_name: [this.project.project_name],
      description: [this.project.description],
      start_date: [this.project.start_date],
      target_date: [this.project.target_date],
    });
  }

  /**
   * Set edit variable to true
   */
  onEditClick(): void {
    this.edit = true;
  }

  /**
   * Make call to project service to update project data on database
   * @param formData form data
   */
  onSaveClick(formData): void {
    // call project update api
    this.projectService
      .updateProject(this.project.id, formData)
      .subscribe((projects: ProjectModel[]) => {
        console.log(projects);
        this.outputProjects(projects);
        this.alertService.addAlert('success', 'Project Saved');
      });
    this.edit = false;
  }

  /**
   * Set edit variable to false
   */
  onCancelClick(): void {
    this.edit = false;
  }

  /**
   * Open delete dialog and delete current project if the delete result is true
   */
  onDeleteClick(): void {
    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      data: { deleteType: 'Project', projectName: this.project.project_name },
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      if (result === 'true') {
        console.log('PROJECT DELETED');
        this.projectService
          .deleteProject(this.project.id)
          .subscribe((projects) => {
            this.outputProjects(projects);
            this.alertService.addAlert('delete', 'Project Deleted');
          });
      }
    });
  }

  /**
   * Return project target date in a more readable format
   * @returns string
   */
  getTargetDate(): string {
    const date = new Date(Date.parse(this.project.target_date));
    return (
      date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
    );
  }

  /**
   * Return project start data in a more readable format
   * @returns string
   */
  getStartDate(): string {
    const date = new Date(Date.parse(this.project.start_date));
    return (
      date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
    );
  }

  /**
   * Output projects array to parent component
   * @param projects array of project of type ProjectModel[]
   */
  outputProjects(projects: ProjectModel[]): void {
    this.projectsOutput.emit(projects);
  }

  /**
   * Navigate to the route of the project page for the current project card
   */
  routeToProject(): void {
    this.router.navigate([`/project/${this.project.id}`]);
  }
}
