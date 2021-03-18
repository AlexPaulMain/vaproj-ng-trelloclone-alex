import { Component, OnInit, Inject } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { SectionModel } from '../../../models/section.model';

@Component({
  selector: 'app-dialog-section',
  templateUrl: './dialog-section.component.html',
  styleUrls: ['./dialog-section.component.css'],
})
export class DialogSectionComponent implements OnInit {
  newSectionForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<DialogSectionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formbuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initialiseForm();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  initialiseForm() {
    this.newSectionForm = this.formbuilder.group({
      heading: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  addSection(formData: SectionModel) {
    this.dialogRef.close(formData);
  }
}
