import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'app-new-project',
  templateUrl: './new-project.component.html',
  styleUrls: ['./new-project.component.css'],
})
export class NewProjectComponent implements OnInit {
  newProjectForm: FormGroup;
  @Output() cancelNewProject = new EventEmitter<boolean>();

  constructor(
    private formBuilder: FormBuilder,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    this.initialiseForm();
  }

  initialiseForm(): void {
    this.newProjectForm = this.formBuilder.group({
      project_name: ['', Validators.required],
      description: ['', Validators.required],
      start_date: ['', Validators.required],
      target_date: ['', Validators.required],
    });
  }

  onSubmit(newProjectDetails) {
    console.log('New project details', newProjectDetails);
    this.projectService.postProject(newProjectDetails).subscribe((data) => {
      console.log(data);
      this.outputCancelNewProject();
    });
  }

  outputCancelNewProject() {
    this.cancelNewProject.emit(false);
  }
}
