import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

/* Models */
import { APIURL } from '../models/api.model';
import { NoteModel } from '../models/note.model';

@Injectable()
export class NoteService {
  constructor(private http: HttpClient) {}

  /**
   * Adds a note to the database and returns an array of all the notes for the specified task
   * @param taskId task id
   * @param note note model
   * @returns Observable of type NoteModel[]
   */
  addNote(taskId: number, note: NoteModel): Observable<NoteModel[]> {
    return this.http.post(`${APIURL}/task/${taskId}/note/`, note).pipe(
      switchMap(() => {
        return this.getNotes(taskId);
      })
    );
  }

  /**
   * Returns an array of all the notes for the specified task
   * @param taskId task id
   * @returns Observable of type NoteModel[]
   */
  getNotes(taskId: number): Observable<NoteModel[]> {
    return this.http.get<NoteModel[]>(`${APIURL}/task/${taskId}/note/`);
  }

  /**
   * Removes note with matching id and returns an array of all the notes for the specified task
   * @param id note id
   * @param taskId task id
   * @returns Observable of type NoteModel[]
   */
  deleteNote(id: number, taskId: number): Observable<NoteModel[]> {
    return this.http.delete(`${APIURL}/note/${id}/`).pipe(
      switchMap(() => {
        return this.getNotes(taskId);
      })
    );
  }

  /**
   * Updates note with matching id and returns an array of all the notes for the specified task
   * @param id note id
   * @param note note object of type NoteModel
   * @param taskId task id
   * @returns Observable of type NoteModel[]
   */
  updateNote(
    id: number,
    note: NoteModel,
    taskId: number
  ): Observable<NoteModel[]> {
    return this.http.put<NoteModel>(`${APIURL}/note/${id}/`, note).pipe(
      switchMap(() => {
        return this.getNotes(taskId);
      })
    );
  }
}
