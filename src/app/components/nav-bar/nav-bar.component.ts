import { Component, OnInit } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';

import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
})
export class NavBarComponent implements OnInit {
  constructor(private authenticationService: AuthenticationService) {}

  ngOnInit(): void {}

  /**
   * Calls logout function from authentication service when the user clicks logout
   */
  callLogout(): void {
    this.authenticationService.logout();
  }
}
