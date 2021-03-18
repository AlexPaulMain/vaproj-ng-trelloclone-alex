import { ValueConverter } from '@angular/compiler/src/render3/view/template';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit {
  constructor(private authenticationService: AuthenticationService) {}

  newProject: boolean = false;
  displayProjectList: boolean = true;

  ngOnInit(): void {
    this.authenticationService.startInterval();
    this.authenticationService.startTokenRefresh();
  }

  createNewProject(value) {
    this.newProject = value;
    this.displayProjectList = !value;
  }

  cancelNewProject(value) {
    this.newProject = value;
    this.displayProjectList = !value;
  }
}
