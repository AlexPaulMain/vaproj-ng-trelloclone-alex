import { Component, OnInit } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';

import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
})
export class NavBarComponent implements OnInit {
  @Output() createNewProject = new EventEmitter<boolean>();

  constructor(private authenticationService: AuthenticationService) {}

  ngOnInit(): void {}

  callLogout() {
    this.authenticationService.logout();
  }

  outputCreateNewProject() {
    this.createNewProject.emit(true);
  }
}
