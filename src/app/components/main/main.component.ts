import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit {
  constructor(private authenticationService: AuthenticationService) {}

  newProject = false;
  displayProjectList = true;

  ngOnInit(): void {
    this.authenticationService.startInterval();
    this.authenticationService.startTokenRefresh();
  }

  /**
   * Sets html display booleans to appropriate values output from project list child component
   * @param value boolean
   */
  updateDisplay(value): void {
    this.newProject = value;
    this.displayProjectList = !value;
  }
}
