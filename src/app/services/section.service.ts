import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

/* Models */
import { APIURL } from '../models/api.model';
import { SectionModel } from '../models/section.model';
import { ProjectModel } from '../models/project.model';

@Injectable()
export class SectionService {
  constructor(private http: HttpClient) {}

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
    section_id: number,
    follows_section_id: number
  ) {
    return this.http.put(
      `${APIURL}/section/${section_id}/insert_after/${follows_section_id}/`,
      sectionData
    );
  }

  deleteSection(sectionId: number, projectId: number) {
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
  ) {
    return this.http.put(`${APIURL}/section/${sectionId}/`, sectionData).pipe(
      switchMap(() => {
        return this.getSections(projectId);
      })
    );
  }
}
