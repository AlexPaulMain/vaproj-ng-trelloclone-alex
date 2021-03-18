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

  postProject(projectDetails: ProjectModel): Observable<Object> {
    return this.http.post<ProjectModel>(`${APIURL}/project/`, projectDetails);
  }

  getProjects(): Observable<ProjectModel[]> {
    return this.http.get<ProjectModel[]>(`${APIURL}/project/`);
  }

  updateProject(id: number, projectDetails: ProjectModel) {
    return this.http
      .put<ProjectModel>(`${APIURL}/project/${id}/`, projectDetails)
      .pipe(
        switchMap(() => {
          return this.getProjects();
        })
      );
  }

  deleteProject(id: number) {
    return this.http.delete(`${APIURL}/project/${id}/`).pipe(
      switchMap(() => {
        return this.getProjects();
      })
    );
  }
}
