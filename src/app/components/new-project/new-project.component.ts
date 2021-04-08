import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AlertService } from 'src/app/services/alert.service';
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
    private projectService: ProjectService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.initialiseForm();
  }

  /**
   * Initialise newProjectForm using FormBuilder
   */
  initialiseForm(): void {
    this.newProjectForm = this.formBuilder.group({
      project_name: ['', Validators.required],
      description: ['', Validators.required],
      start_date: ['', Validators.required],
      target_date: ['', Validators.required],
    });
  }

  /**
   * On form submission this functon is called
   * @param newProjectDetails form data
   */
  onSubmit(newProjectDetails): void {
    this.projectService.postProject(newProjectDetails).subscribe((data) => {
      console.log('Updated projects from api:', data);
      this.outputCancelNewProject();
      // alert
      this.alertService.addAlert('success', 'New Project Created!', 'Close');
    });
  }

  /**
   * Output 'false' to parent component
   */
  outputCancelNewProject(): void {
    this.cancelNewProject.emit(false);
  }

  dateFilter = (): boolean => {
    console.log('run filter');
    console.log('start', this.newProjectForm.controls.start_date.value);
    console.log('target', this.newProjectForm.controls.target_date.value);
    if (
      this.newProjectForm.controls.start_date.value <=
      this.newProjectForm.controls.target_date.value
    ) {
      console.log('true');
      return true;
    } else {
      return false;
    }
  };
}
