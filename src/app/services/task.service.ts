import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

/* Models */
import { APIURL } from '../models/api.model';
import { SectionModel } from '../models/section.model';
import { ProjectModel } from '../models/project.model';
import { TaskModel } from '../models/task.model';

@Injectable()
export class TaskService {
  constructor(private http: HttpClient) {}

  addTask(task: TaskModel, sectionId: number): Observable<TaskModel[]> {
    return this.http.post(`${APIURL}/section/${sectionId}/task/`, task).pipe(
      switchMap(() => {
        return this.getTasks(sectionId);
      })
    );
  }

  getTasks(sectionId: number): Observable<TaskModel[]> {
    return this.http.get<TaskModel[]>(`${APIURL}/section/${sectionId}/task/`);
  }

  updateTask(id: number, task: TaskModel, sectionId: number) {
    return this.http.put(`${APIURL}/task/${id}/`, task).pipe(
      switchMap(() => {
        return this.getTasks(sectionId);
      })
    );
  }

  deleteTask(id: number, sectionId: number): Observable<TaskModel[]> {
    return this.http.delete(`${APIURL}/task/${id}/`).pipe(
      switchMap(() => {
        return this.getTasks(sectionId);
      })
    );
  }

  moveTask(sectionId: number, id: number, followsId: number, task: TaskModel) {
    return this.http.put(
      `${APIURL}/section/${sectionId}/task/${id}/insert_after/${followsId}/`,
      task
    );
  }
}
