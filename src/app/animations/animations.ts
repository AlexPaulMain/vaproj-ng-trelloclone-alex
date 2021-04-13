import {
  animate,
  query,
  stagger,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

export let fade = trigger('fade', [
  state('void', style({ opacity: 0 })),
  transition('void => *', animate(600)),
]);

export let slide = trigger('slide', [
  state('void', style({ transform: 'translateX(-10px)' })),
  transition('void => *', animate(600)),
]);
