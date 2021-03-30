import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

/* Models */
import { APIURL } from '../models/api.model';
import { ProjectModel } from '../models/project.model';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable()
export class ProjectService {
  constructor(private http: HttpClient) {}

  /**
   * Adds new project to the database
   * @param projectDetails ProjectModel object
   * @returns Observable of type ProjectModel
   */
  postProject(projectDetails: ProjectModel): Observable<ProjectModel> {
    return this.http.post<ProjectModel>(`${APIURL}/project/`, projectDetails);
  }

  /**
   * Returns an array of all the projects
   * @returns Observable of type ProjectModel[]
   */
  getProjects(): Observable<ProjectModel[]> {
    return this.http.get<ProjectModel[]>(`${APIURL}/project/`);
  }

  /**
   * Updates project details on the database for the specifed project and
   * returns an array of all the projects
   * @param id project id
   * @param projectDetails ProjectModel object
   * @returns Observable of type ProjectModel[]
   */
  updateProject(
    id: number,
    projectDetails: ProjectModel
  ): Observable<ProjectModel[]> {
    return this.http
      .put<ProjectModel>(`${APIURL}/project/${id}/`, projectDetails)
      .pipe(
        switchMap(() => {
          return this.getProjects();
        })
      );
  }

  /**
   * Deletes specified project and returns an array of all the projects
   * @param id project id
   * @returns Observable of type ProjectModel[]
   */
  deleteProject(id: number): Observable<ProjectModel[]> {
    return this.http.delete(`${APIURL}/project/${id}/`).pipe(
      switchMap(() => {
        return this.getProjects();
      })
    );
  }

  /**
   * Returns project of specified id
   * @param id project id
   * @returns Observable of type ProjectModel
   */
  getProject(id: number): Observable<ProjectModel> {
    return this.http.get<ProjectModel>(`${APIURL}/project/${id}/`);
  }
}
