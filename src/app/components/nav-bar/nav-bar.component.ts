import { Component, OnDestroy, OnInit } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { AuthenticationService } from '../../services/authentication.service';
import { DialogSettingsComponent } from '../dialogs/dialog-settings/dialog-settings.component';
import { BackgroundService } from '../../services/background.service';
import { DialogUserComponent } from '../dialogs/dialog-user/dialog-user.component';
import { AlertService } from 'src/app/services/alert.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
})
export class NavBarComponent implements OnInit, OnDestroy {
  userName = JSON.parse(localStorage.getItem('userSession')).username;
  tokenRefresh: Subscription;

  constructor(
    private authenticationService: AuthenticationService,
    private dialog: MatDialog,
    private backgroundService: BackgroundService,
    private alertService: AlertService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.tokenRefresh = this.authenticationService
      .startTokenRefresh()
      .subscribe(() => this.authenticationService.refreshAccessToken());
    // alert service subscription
    this.alertService.alertsSubject.subscribe((alerts) => {
      alerts.forEach((alert) => {
        // display alert
        console.log('Alert:', alert.message);
        this.snackBar.open(alert.message, alert.closeMessage, {
          duration: 3000,
          panelClass: [this.alertService.getColor(alert.type)],
        });
        // delete alert
        this.alertService.removeAlert(alert.id);
      });
    });
  }

  ngOnDestroy(): void {
    this.tokenRefresh.unsubscribe();
  }

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
