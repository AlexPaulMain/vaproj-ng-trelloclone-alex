import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

/* Models */
import { APIURL } from '../models/api.model';
import { TaskModel } from '../models/task.model';

@Injectable()
export class TaskService {
  constructor(private http: HttpClient) {}

  /**
   * Adds task to database and returns an array of all the tasks for te specified section
   * @param task task object of type TaskModel
   * @param sectionId section id
   * @returns Observable of type TaskModel[]
   */
  addTask(task: TaskModel, sectionId: number): Observable<TaskModel[]> {
    return this.http.post(`${APIURL}/section/${sectionId}/task/`, task).pipe(
      switchMap(() => {
        return this.getTasks(sectionId);
      })
    );
  }

  /**
   * Returns an array of all the tasks for the specified section
   * @param sectionId section id
   * @returns Observable of type TaskModel[]
   */
  getTasks(sectionId: number): Observable<TaskModel[]> {
    return this.http.get<TaskModel[]>(`${APIURL}/section/${sectionId}/task/`);
  }

  /**
   * Updates the specifed task and returns an array of all the tasks for the specified section
   * @param id task id
   * @param task task object of type TaskModel
   * @param sectionId section id
   * @returns Observable of type TaskModel[]
   */
  updateTask(
    id: number,
    task: TaskModel,
    sectionId: number
  ): Observable<TaskModel[]> {
    return this.http.put(`${APIURL}/task/${id}/`, task).pipe(
      switchMap(() => {
        return this.getTasks(sectionId);
      })
    );
  }

  /**
   * Deletes specifed task from database and returns an array of all the tasks for the specifed section
   * @param id task id
   * @param sectionId section id
   * @returns Observable of type TaskModel[]
   */
  deleteTask(id: number, sectionId: number): Observable<TaskModel[]> {
    return this.http.delete(`${APIURL}/task/${id}/`).pipe(
      switchMap(() => {
        return this.getTasks(sectionId);
      })
    );
  }

  /**
   * Changes position of task in the database
   * @param sectionId section id
   * @param id task id
   * @param followsId id of task the current task should follow
   * @param task task object of type TaskModel
   * @returns Observable of type TaskModel
   */
  moveTask(
    sectionId: number,
    id: number,
    followsId: number,
    task: TaskModel
  ): Observable<TaskModel> {
    return this.http.put<TaskModel>(
      `${APIURL}/section/${sectionId}/task/${id}/insert_after/${followsId}/`,
      task
    );
  }
}
