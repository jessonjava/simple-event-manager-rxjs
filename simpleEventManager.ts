import { BehaviorSubject, Subject } from 'rxjs';

class SimpleEventManager {
  private static registeredEvents: {
    eventName: string;
    subject: Subject<any>;
  }[] = [];

  private static getEventFromEventName(eventName) {
    return SimpleEventManager.registeredEvents.find((event) => {
      return event.eventName === eventName;
    });
  }

  static register<T>(eventName: string, initValue: T) {
    if (SimpleEventManager.getEventFromEventName(eventName)) {
      console.warn(`${eventName} already registered`);
      return;
    }
    SimpleEventManager.registeredEvents.push({
      eventName,
      subject: new BehaviorSubject<T>(initValue),
    });
  }
  static unregister(eventName: string) {
    const event = SimpleEventManager.getEventFromEventName(eventName);
    event.subject.complete();
    SimpleEventManager.registeredEvents =
      SimpleEventManager.registeredEvents.filter(
        (event) => event.eventName !== eventName
      );
  }
  static when(eventName: string, callback) {
    const event = SimpleEventManager.getEventFromEventName(eventName);
    if (!event) {
      console.warn(`No event called ${eventName} registered`);
      return;
    }
    return event.subject.subscribe(callback);
  }
  static emit(eventName: string, updatedValueCallback) {
    const event = SimpleEventManager.getEventFromEventName(eventName);
    if (!event) {
      console.warn(`No event called ${eventName} registered`);
      return;
    }
    const nextValue = updatedValueCallback(event.subject.getValue());
    event.subject.next(nextValue);
  }
}

export { SimpleEventManager };
