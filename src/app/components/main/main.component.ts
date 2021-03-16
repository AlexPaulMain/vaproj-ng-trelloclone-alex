import { ValueConverter } from '@angular/compiler/src/render3/view/template';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit {
  constructor() {}

  newProject: boolean = false;

  ngOnInit(): void {}

  createNewProject(value) {
    this.newProject = value;
  }

  cancelNewProject(value) {
    this.newProject = value;
  }
}
