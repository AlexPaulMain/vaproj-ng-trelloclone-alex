import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-project',
  templateUrl: './edit-project.component.html',
  styleUrls: ['./edit-project.component.css'],
})
export class EditProjectComponent implements OnInit {
  editProjectForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.editProjectForm = this.formBuilder.group({
      project_name: [''],
      description: [''],
      start_date: [''],
      target_date: [''],
    });
  }

  onSubmit(editProjectDeatails): void {
    console.log(editProjectDeatails);
  }
}
