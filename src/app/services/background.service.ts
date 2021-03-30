import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class BackgroundService {
  background = new BehaviorSubject<string>('background-0');

  constructor() {}

  setBackground(background: string): void {
    switch (background) {
      case 'default':
        this.background.next('background-0');
        break;
      case 'beach':
        this.background.next('background-1');
        break;
      case 'splash':
        this.background.next('background-2');
        break;
      case 'clouds':
        this.background.next('background-3');
        break;
    }
    localStorage.setItem('background', this.background.value);
  }

  getBackground(): BehaviorSubject<string> {
    if (localStorage.getItem('background')) {
      this.background.next(localStorage.getItem('background'));
    } else {
      localStorage.setItem('background', 'background-0');
    }
    return this.background;
  }
}
