import './style.css';

import { fromEvent } from 'rxjs';
import { emit, register, unregister, when } from './simpleEventManager';
import { take } from 'rxjs/operators';

const eventEmitter$ = fromEvent(document.getElementById('emit'), 'click');
const unsub$ = fromEvent(document.getElementById('unsub'), 'click');
const unreg$ = fromEvent(document.getElementById('unreg'), 'click');

// register an event with a name and initial state
register('button-click', 0);

eventEmitter$.subscribe(() => {
  // emit a registered event, the callback's return value will be the new state value(for the event).
  emit('button-click', (currentVal) => {
    return currentVal + 10;
  });
});

// listen for events with a specific name, the value of the event's state is provided in the callback.
const subscription = when('button-click', (val) => {
  console.log(val);
});

// unsubscribe directly
unsub$.pipe(take(1)).subscribe(() => {
  subscription.unsubscribe();
});

// add another listener to an event
when('button-click', () => {
  console.log('another sub to button-click');
});

// unregister a whole event
unreg$.pipe(take(1)).subscribe(() => {
  unregister('button-click');
});

// try to use a non-existent event: logs a warning then quits
when('error', () => {});

// try to register an already registered event: logs a warning then quits
register('button-click', 1000);
