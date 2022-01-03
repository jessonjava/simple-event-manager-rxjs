import { BehaviorSubject, Observer } from 'rxjs';

interface RegisteredEvent {
  eventName: string;
  subject: BehaviorSubject<any>;
}

export default class SimpleEventManager {
  private static _registeredEvents: RegisteredEvent[] = [];

  static getEventFromEventName(eventName: string): RegisteredEvent | null {
    return (
      SimpleEventManager._registeredEvents.find((event) => {
        return event.eventName === eventName;
      }) ?? null
    );
  }

  static get registeredEvents(): RegisteredEvent[] {
    return this._registeredEvents;
  }

  static set registeredEvents(events: RegisteredEvent[]) {
    this._registeredEvents = events;
  }
}

export const emit = (
  eventName: string,
  updateStateAction: (value: any) => any
) => {
  const event = SimpleEventManager.getEventFromEventName(eventName);
  if (!event) {
    console.warn(`No event called ${eventName} registered`);
    return;
  }
  const nextValue = updateStateAction(event.subject.getValue());
  event.subject.next(nextValue);
};

export const register = (eventName: string, initValue: any) => {
  if (SimpleEventManager.getEventFromEventName(eventName)) {
    console.warn(`${eventName} already registered`);
    return;
  }
  SimpleEventManager.registeredEvents.push({
    eventName,
    subject: new BehaviorSubject(initValue),
  });
};

export const unregister = (eventName: string) => {
  const event: RegisteredEvent | null =
    SimpleEventManager.getEventFromEventName(eventName);
  if (!event) return;
  event.subject.complete();
  SimpleEventManager.registeredEvents =
    SimpleEventManager.registeredEvents.filter(
      (event) => event.eventName !== eventName
    );
};

export const when = (
  eventName: string,
  oberserverActions: Observer<any> | Partial<(any) => any>
) => {
  const event = SimpleEventManager.getEventFromEventName(eventName);
  if (!event) {
    console.warn(`No event called ${eventName} registered`);
    return;
  }
  return event.subject.subscribe(oberserverActions);
};
