import { Component, OnInit } from '@angular/core';
import { BackgroundService } from 'src/app/services/background.service';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit {
  newProject = false;
  displayProjectList = true;
  backgroundClass: string;

  constructor(
    private authenticationService: AuthenticationService,
    private backgroundService: BackgroundService
  ) {}

  ngOnInit(): void {
    this.backgroundService.getBackground().subscribe((value) => {
      this.backgroundClass = value;
    });
  }

  /**
   * Sets html display booleans to appropriate values output from project
   * list child component
   * @param value boolean
   */
  updateDisplay(value): void {
    this.newProject = value;
    this.displayProjectList = !value;
  }
}
