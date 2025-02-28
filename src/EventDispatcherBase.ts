export interface EventHandler<T> {
  (value: T): any;
}

/**
 * @typeParam TValue - The type of the argument passed to subscribers.
 * @typeParam THandler - The type of the callback function.
 */
export abstract class EventDispatcherBase<
  TValue,
  THandler extends EventHandler<TValue> = EventHandler<TValue>
> {
  private subscribers = new Set<THandler>();

  public subscribe(handler: THandler) {
    this.subscribers.add(handler);
    return () => this.unsubscribe(handler);
  }

  public unsubscribe(handler: THandler) {
    this.subscribers.delete(handler);
  }

  /**
   * Unsubscribe all subscribers from the event.
   */
  public clear() {
    this.subscribers.clear();
  }

  protected notifySubscribers(value: TValue) {
    for (const handler of this.subscribers) {
      handler(value);
    }
  }
}
