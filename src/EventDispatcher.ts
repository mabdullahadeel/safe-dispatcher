import { EventDispatcherBase } from "./EventDispatcherBase";

/**
 * @example
 * ```ts
 * class Example {
 *   // expose the event to external classes
 *   public get onValueChanged {
 *     return this.value.subscribable;
 *   }
 *   // create a private dispatcher
 *   private value = new EventDispatcher<number>();
 *
 *   private dispatchExample() {
 *     // dispatching will notify all subscribers.
 *     this.value.dispatch(0);
 *   }
 * }
 * ```
 *
 * @typeParam T - The type of the value argument to subscribers.
 */
export class EventDispatcher<T> extends EventDispatcherBase<T> {
  public dispatch(value: T) {
    this.notifySubscribers(value);
  }
}
