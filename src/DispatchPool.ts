import { EventDispatcher } from "./EventDispatcher";
import type { ExtractGeneric } from "./types";

export class DispatcherPool<
  TPool extends Record<string, EventDispatcher<any>>
> {
  private dispatcherMap: TPool = {} as TPool;

  public constructor(pool: TPool) {
    this.dispatcherMap = pool;
  }

  public on<K extends keyof TPool>(
    key: K,
    cb: (v: ExtractGeneric<TPool[K]>) => void
  ) {
    return this.dispatcherMap[key].subscribe(cb);
  }

  public off<K extends keyof TPool>(key: K, handler: () => void) {
    this.dispatcherMap[key].unsubscribe(handler);
  }

  public dispatch<K extends keyof TPool>(
    key: K,
    value: ExtractGeneric<TPool[K]>
  ) {
    this.dispatcherMap[key].dispatch(value);
  }

  /**
   * ## Unsubscribe all subscribers from the event.
   *
   * @caution
   * Make sure you know what you are doing while calling this method.
   * This method will unsubscribe all subscribers from all events.
   * Only call this method in case of module unloading or similar.
   */
  public destroy() {
    for (const key in this.dispatcherMap) {
      this.dispatcherMap[key].clear();
    }
  }
}
