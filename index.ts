import './style.css';

import { fromEvent } from 'rxjs';
import { SimpleEventManager } from './simpleEventManager';
import { take } from 'rxjs/operators';

const eventEmitter$ = fromEvent(document.getElementById('emit'), 'click');
const unsub$ = fromEvent(document.getElementById('unsub'), 'click');
const unreg$ = fromEvent(document.getElementById('unreg'), 'click');

// register an event with a name and default value
SimpleEventManager.register<number>('button-click', 0);

eventEmitter$.subscribe(() => {
  SimpleEventManager.emit('button-click', (currentVal) => {
    return currentVal + 10;
  });
});

// listen for events with a specific name
const subscription = SimpleEventManager.when('button-click', (val) => {
  console.log(val);
});

// unsubscribe directly
unsub$.pipe(take(1)).subscribe(() => {
  subscription.unsubscribe();
});

// add another listener to an event
SimpleEventManager.when('button-click', () => {
  console.log('another sub to button-click');
});

// unregister a whole event
unreg$.pipe(take(1)).subscribe(() => {
  SimpleEventManager.unregister('button-click');
});

// try to use a non-existent event: logs a warning then quits
SimpleEventManager.when('error', () => {});

// try to register an already registered event: logs a warning then quits
SimpleEventManager.register('button-click', 1000);
