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

  /**
   * Retrieve and set array of all projects
   */
  getProjects(): void {
    this.projectService.getProjects().subscribe((projects) => {
      console.log('Projects fetched from api:', projects);
      this.projects = projects;
    });
  }

  /**
   * Output createNewProject boolean as true to parent component
   */
  outputCreateNewProject(): void {
    this.createNewProject.emit(true);
  }

  /**
   * Set projects array to array of given projects
   * @param projects array of projects of type ProjectModel[]
   */
  updateProjects(projects: ProjectModel[]): void {
    this.projects = projects;
  }
}
