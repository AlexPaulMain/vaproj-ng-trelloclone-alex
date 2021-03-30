import { Component, OnInit } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { AuthenticationService } from '../../services/authentication.service';
import { DialogSettingsComponent } from '../dialogs/dialog-settings/dialog-settings.component';
import { BackgroundService } from '../../services/background.service';
import { DialogUserComponent } from '../dialogs/dialog-user/dialog-user.component';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
})
export class NavBarComponent implements OnInit {
  userName = JSON.parse(localStorage.getItem('userSession')).username;

  constructor(
    private authenticationService: AuthenticationService,
    private dialog: MatDialog,
    private backgroundService: BackgroundService
  ) {}

  ngOnInit(): void {}

  /**
   * Calls logout function from authentication service when the user
   * clicks logout
   */
  callLogout(): void {
    this.authenticationService.logout();
  }

  /**
   * Opens settings dialog
   */
  onSettingsClick(): void {
    const dialogRef = this.dialog.open(DialogSettingsComponent, {
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      this.backgroundService.setBackground(result);
    });
  }

  /**
   * Open user settings dialog
   */
  onUserClick(): void {
    const dialogRef = this.dialog.open(DialogUserComponent);
  }
}
