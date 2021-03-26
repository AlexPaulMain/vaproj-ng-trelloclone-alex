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
export class SectionService {
  tasks = {};

  constructor(private http: HttpClient) {}

  storeTasks(tasks: Object): void {
    this.tasks = Object.assign(this.tasks, tasks);
  }

  getSections(projectId: number): Observable<SectionModel[]> {
    return this.http.get<SectionModel[]>(
      `${APIURL}/project/${projectId}/section/`
    );
  }

  addSection(
    projectId: number,
    sectionData: SectionModel
  ): Observable<SectionModel[]> {
    return this.http
      .post<SectionModel>(
        `${APIURL}/project/${projectId}/section/`,
        sectionData
      )
      .pipe(switchMap(() => this.getSections(projectId)));
  }

  moveSection(
    sectionData: SectionModel,
    sectionId: number,
    followsId: number
  ): Observable<SectionModel> {
    return this.http.put<SectionModel>(
      `${APIURL}/section/${sectionId}/insert_after/${followsId}/`,
      sectionData
    );
  }

  deleteSection(
    sectionId: number,
    projectId: number
  ): Observable<SectionModel[]> {
    return this.http.delete(`${APIURL}/section/${sectionId}/`).pipe(
      switchMap(() => {
        return this.getSections(projectId);
      })
    );
  }

  updateSection(
    sectionId: number,
    sectionData: SectionModel,
    projectId: number
  ): Observable<SectionModel[]> {
    return this.http.put(`${APIURL}/section/${sectionId}/`, sectionData).pipe(
      switchMap(() => {
        return this.getSections(projectId);
      })
    );
  }
}
