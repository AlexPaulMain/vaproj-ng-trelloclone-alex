import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ProjectModel } from 'src/app/models/project.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DialogDeleteComponent } from '../dialogs/dialog-delete/dialog-delete.component';
import { ProjectService } from '../../services/project.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-project-card',
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.css'],
})
export class ProjectCardComponent implements OnInit {
  @Input() project: ProjectModel;
  edit: boolean = false;
  editProjectForm: FormGroup;
  @Output() projectsOutput = new EventEmitter<ProjectModel[]>();

  constructor(
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private projectService: ProjectService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.editProjectForm = this.formBuilder.group({
      project_name: [this.project.project_name],
      description: [this.project.description],
      start_date: [this.project.start_date],
      target_date: [this.project.target_date],
    });
  }

  onEditClick() {
    this.edit = true;
  }

  onSaveClick(formData) {
    //call project update api
    this.projectService
      .updateProject(this.project.id, formData)
      .subscribe((projects: ProjectModel[]) => {
        console.log(projects);
        this.outputProjects(projects);
      });
    this.edit = false;
  }

  onCancelClick() {
    this.edit = false;
  }

  onDeleteClick() {
    let dialogRef = this.dialog.open(DialogDeleteComponent, {
      data: { deleteType: 'Project', projectName: this.project.project_name },
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      if (result == 'true') {
        console.log('PROJECT DELETED');
        this.projectService
          .deleteProject(this.project.id)
          .subscribe((projects) => {
            this.outputProjects(projects);
          });
      }
    });
  }

  getTargetDate() {
    let date = new Date(Date.parse(this.project.target_date));
    return (
      date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
    );
  }

  getStartDate() {
    let date = new Date(Date.parse(this.project.start_date));
    return (
      date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
    );
  }

  outputProjects(projects: ProjectModel[]) {
    this.projectsOutput.emit(projects);
  }
}
