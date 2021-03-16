import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-new-project',
  templateUrl: './new-project.component.html',
  styleUrls: ['./new-project.component.css'],
})
export class NewProjectComponent implements OnInit {
  newProjectForm: FormGroup;
  @Output() cancelNewProject = new EventEmitter<boolean>();

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.initialiseForm();
  }

  initialiseForm(): void {
    this.newProjectForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      startDate: ['', Validators.required],
      targetDate: ['', Validators.required],
    });
  }

  onSubmit(deets) {
    console.log(deets);
  }

  outputCancelNewProject() {
    this.cancelNewProject.emit(false);
  }
}
