import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { NoteModel } from 'src/app/models/note.model';
import { AlertService } from 'src/app/services/alert.service';
import { NoteService } from 'src/app/services/note.service';
import { DialogDeleteComponent } from '../dialog-delete/dialog-delete.component';

@Component({
  selector: 'app-dialog-task',
  templateUrl: './dialog-task.component.html',
  styleUrls: ['./dialog-task.component.css'],
})
export class DialogTaskComponent implements OnInit {
  edit = false;
  editTaskForm: FormGroup;
  notes: NoteModel[];

  constructor(
    private dialogRef: MatDialogRef<DialogTaskComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private noteService: NoteService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    // form initialisation
    this.editTaskForm = this.formBuilder.group({
      heading: [this.data.heading, Validators.required],
      description: [this.data.description, Validators.required],
      start_date: [this.data.start_date],
      target_date: [this.data.target_date],
      user: [this.data.user],
    });
    // get notes from api
    this.noteService.getNotes(this.data.id).subscribe((notes) => {
      this.notes = notes;
    });
  }

  /**
   * Closes dialog on no click
   */
  onNoClick(): void {
    this.dialogRef.close();
  }

  /**
   * Sets edit variable to true if the user clicks on the task display
   * information
   */
  onTaskInfoClick(): void {
    this.edit = true;
  }

  /**
   * Reset task form with data from the task component and change the edit
   * variable to false
   */
  onConfirmClick(): void {
    this.editTaskForm.reset(this.data);
    this.edit = false;
  }

  /**
   * Reset form to original data and set edit to false when the user
   * clicks on the clear icon
   */
  onCancelClick(): void {
    this.editTaskForm.reset(this.data);
    this.edit = false;
  }

  /**
   * Close the dialog when the user clicks on the cancel button
   */
  onCancelButtonClick(): void {
    this.dialogRef.close();
  }

  /**
   * Delete the current task when the user clicks on the delete icon
   */
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

  /**
   * Returns task start date in more readable format
   * @returns string
   */
  formatStartDate(): string {
    const date = new Date(Date.parse(this.data.start_date));
    return (
      date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
    );
  }

  /**
   * Returns task target date in more readable format
   * @returns string
   */
  formatTargetDate(): string {
    const date = new Date(Date.parse(this.data.target_date));
    return (
      date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
    );
  }

  /**
   * Adds empty note to database and updates notes array
   */
  onAddNoteClick(): void {
    // determine task position in list
    let notePos: number;
    if (this.notes.length === 0) {
      notePos = 0;
    } else {
      notePos = this.notes[this.notes.length - 1].note_order + 1;
    }
    const emptyNote: NoteModel = {
      content: 'New Note',
      user: this.data.user,
      note_order: notePos,
    };
    this.noteService.addNote(this.data.id, emptyNote).subscribe((notes) => {
      console.log(notes);
      this.notes = notes;
    });
  }

  /**
   * Updates notes array
   * @param notes notes array of type NoteModel[]
   */
  updateNotes(notes): void {
    this.notes = notes;
  }
}
