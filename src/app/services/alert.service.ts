import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AlertModel } from '../models/alert.model';

@Injectable()
export class AlertService {
  alerts: AlertModel[];
  alertsSubject: BehaviorSubject<AlertModel[]>;

  constructor() {
    this.alerts = [];
    this.alertsSubject = new BehaviorSubject<AlertModel[]>(this.alerts);
  }

  /**
   * Creates and adds alert to alerts array and alerts subject
   * @param type string  'error' | 'warn' | 'success'
   * @param message The message to be displayed
   */
  addAlert(type: string, message: string): void {
    // generate id
    let id: number;
    if (this.alerts.length > 0) {
      id = this.alerts[this.alerts.length - 1].id + 1;
    } else {
      id = 0;
    }
    // create new alert
    const newAlert = new AlertModel(id, type, message);
    // add new alert to array
    this.alerts.push(newAlert);
    // add array to subject
    this.alertsSubject.next(this.alerts);
  }

  // remove alert
  removeAlert(id: number): void {
    const filteredAlerts = this.alerts.filter((alert) => alert.id !== id);
    this.alerts = filteredAlerts;
    this.alertsSubject.next(filteredAlerts);
  }

  getColor(type: string): string {
    switch (type) {
      case 'error':
        return 'red-snackbar';
      case 'success':
        return 'green-snackbar';
      case 'warn':
        return '';
    }
  }
}
