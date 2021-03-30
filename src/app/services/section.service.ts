import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

/* Models */
import { APIURL } from '../models/api.model';
import { SectionModel } from '../models/section.model';

@Injectable()
export class SectionService {
  tasks = {};

  constructor(private http: HttpClient) {}

  /**
   * Merges two task objects and assigns them to the tasks object
   * @param tasks Object which must match the TaskModel format
   */
  storeTasks(tasks: Object): void {
    this.tasks = Object.assign(this.tasks, tasks);
  }

  /**
   * Returns an array of all the sections for the specified project
   * @param projectId project id
   * @returns Observable of type SectionModel[]
   */
  getSections(projectId: number): Observable<SectionModel[]> {
    return this.http.get<SectionModel[]>(
      `${APIURL}/project/${projectId}/section/`
    );
  }

  /**
   * Adds a section to the database and returns an array of sections for
   * the specified project
   * @param projectId project id
   * @param sectionData the section to be added of type SectionModel
   * @returns Observable of type SectionModel[]
   */
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

  /**
   * Changes section position
   * @param sectionData sectionModel
   * @param sectionId section id
   * @param followsId id of section the current section must follow
   * @returns Observable of type SectionModel
   */
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

  /**
   * Deletes specified section from database and returns and array of all
   * the sections
   * @param sectionId section id
   * @param projectId project id
   * @returns Observable of type SectionModel[]
   */
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

  /**
   * Updates the specified section and returns an array of all the sections
   * @param sectionId section id
   * @param sectionData SectionModel
   * @param projectId project id
   * @returns Observable of type SectionModel[]
   */
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
