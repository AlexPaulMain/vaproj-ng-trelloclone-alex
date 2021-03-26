import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { DialogDeleteComponent } from '../dialog-delete/dialog-delete.component';

@Component({
  selector: 'app-dialog-task',
  templateUrl: './dialog-task.component.html',
  styleUrls: ['./dialog-task.component.css'],
})
export class DialogTaskComponent implements OnInit {
  edit = false;
  editTaskForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<DialogTaskComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.editTaskForm = this.formBuilder.group({
      heading: [this.data.heading, Validators.required],
      description: [this.data.description, Validators.required],
      start_date: [this.data.start_date],
      target_date: [this.data.target_date],
      user: [this.data.user],
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onTaskInfoClick(): void {
    this.edit = true;
  }

  onConfirmClick(formData): void {
    // update tasks (make api call)
    this.editTaskForm.reset(this.data);
    this.edit = false;
  }

  onCancelClick(): void {
    this.editTaskForm.reset(this.data);
    this.edit = false;
  }

  onCancelButtonClick(): void {
    this.dialogRef.close();
  }

  onDeleteClick(): void {
    const dialogRefDelete = this.dialog.open(DialogDeleteComponent, {
      data: { deleteType: 'Task', projectName: this.data.heading },
    });
    dialogRefDelete.afterClosed().subscribe((result) => {
      console.log(result);
      if (result === 'true') {
        console.log('SECTION DELETED');
        this.dialogRef.close('delete');
      }
    });
  }

  formatStartDate(): string {
    const date = new Date(Date.parse(this.data.start_date));
    return (
      date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
    );
  }

  formatTargetDate(): string {
    const date = new Date(Date.parse(this.data.target_date));
    return (
      date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
    );
  }
}
