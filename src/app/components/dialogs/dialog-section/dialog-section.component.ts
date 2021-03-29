import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  /**
   * Initialises newSectionForm using a formbuilder
   */
  initialiseForm(): void {
    this.newSectionForm = this.formbuilder.group({
      heading: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  /**
   * Sends form data to dialog parent on dialog close
   * @param formData form data of type SectionModel
   */
  addSection(formData: SectionModel): void {
    this.dialogRef.close(formData);
  }
}
