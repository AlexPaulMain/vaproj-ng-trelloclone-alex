import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NoteModel } from 'src/app/models/note.model';
import { NoteService } from 'src/app/services/note.service';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.css'],
})
export class NoteComponent implements OnInit {
  edit = false;
  @Input() note: NoteModel;
  @Input() taskId: number;
  @Output() notes = new EventEmitter<NoteModel[]>();
  noteFormControl = new FormControl();

  constructor(private noteService: NoteService) {}

  ngOnInit(): void {
    this.noteFormControl.setValue(this.note.content);
  }

  /**
   * Set edit variable to true when the user clicks on the note
   */
  onNoteClick(): void {
    this.edit = true;
  }

  /**
   * Update the note data both locally and on the database and set edit variable to false
   */
  onSaveNoteClick(): void {
    this.note.content = this.noteFormControl.value;
    // call api to update note
    this.noteService
      .updateNote(this.note.id, this.note, this.taskId)
      .subscribe((notes) => {
        this.outputNotes(notes);
        this.noteFormControl.reset(this.note.content);
      });
    this.edit = false;
  }

  /**
   * Delete current note
   */
  onDeleteNoteClick(): void {
    this.noteService
      .deleteNote(this.note.id, this.taskId)
      .subscribe((notes) => {
        this.outputNotes(notes);
      });
  }

  /**
   * Output notes array to parent component
   * @param notes notes array of type NoteModel[]
   */
  outputNotes(notes): void {
    this.notes.emit(notes);
  }
}
