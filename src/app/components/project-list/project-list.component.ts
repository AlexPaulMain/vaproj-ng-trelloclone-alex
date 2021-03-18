import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ProjectService } from '../../services/project.service';

import { ProjectModel } from '../../models/project.model';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css'],
})
export class ProjectListComponent implements OnInit {
  projects: ProjectModel[];
  @Output() createNewProject = new EventEmitter<boolean>();

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.getProjects();
  }

  getProjects() {
    this.projectService.getProjects().subscribe((data) => {
      console.log(data);
      this.projects = data;
    });
  }

  outputCreateNewProject() {
    this.createNewProject.emit(true);
  }

  updateProjects(projects: ProjectModel[]) {
    this.projects = projects;
  }
}
