import { describe, it, expect, mock } from "bun:test";
import { DispatcherPool } from "./DispatchPool";
import { EventDispatcher } from "./EventDispatcher";

describe("DispatchPool", () => {
  it("should initialize with a pool of dispatchers", () => {
    const dispatcherMap = {
      stringEvent: new EventDispatcher<string>(),
      numberEvent: new EventDispatcher<number>(),
      objectEvent: new EventDispatcher<{ id: string; value: number }>(),
    } as const;

    const pool = new DispatcherPool(dispatcherMap);
    expect(pool).toBeDefined();
  });

  it("should allow subscribing to events and receiving dispatched values", () => {
    const dispatcherMap = {
      stringEvent: new EventDispatcher<string>(),
      numberEvent: new EventDispatcher<number>(),
      objectEvent: new EventDispatcher<{ id: string; value: number }>(),
    } as const;

    const pool = new DispatcherPool(dispatcherMap);

    const stringHandler = mock((value: string) => {});
    const numberHandler = mock((value: number) => {});
    const objectHandler = mock((value: { id: string; value: number }) => {});

    pool.on("stringEvent", stringHandler);
    pool.on("numberEvent", numberHandler);
    pool.on("objectEvent", objectHandler);

    pool.dispatch("stringEvent", "test message");
    pool.dispatch("numberEvent", 42);
    pool.dispatch("objectEvent", { id: "test", value: 100 });

    expect(stringHandler).toHaveBeenCalledWith("test message");
    expect(numberHandler).toHaveBeenCalledWith(42);
    expect(objectHandler).toHaveBeenCalledWith({ id: "test", value: 100 });
  });

  it("should unsubscribe handlers correctly", () => {
    const dispatcherMap = {
      testEvent: new EventDispatcher<string>(),
    } as const;

    const pool = new DispatcherPool(dispatcherMap);

    const handler = mock((value: string) => {});
    const unsubscribe = pool.on("testEvent", handler);

    // First dispatch should trigger the handler
    pool.dispatch("testEvent", "first message");
    expect(handler).toHaveBeenCalledTimes(1);

    unsubscribe();

    // Second dispatch should not trigger the handler
    pool.dispatch("testEvent", "second message");
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("should clear all handlers when destroy is called", () => {
    const dispatcherMap = {
      eventA: new EventDispatcher<string>(),
      eventB: new EventDispatcher<number>(),
    } as const;

    const pool = new DispatcherPool(dispatcherMap);

    const handlerA = mock((value: string) => {});
    const handlerB = mock((value: number) => {});

    pool.on("eventA", handlerA);
    pool.on("eventB", handlerB);

    // First dispatch should trigger handlers
    pool.dispatch("eventA", "message");
    pool.dispatch("eventB", 123);

    expect(handlerA).toHaveBeenCalledTimes(1);
    expect(handlerB).toHaveBeenCalledTimes(1);

    // Destroy all handlers
    pool.destroy();

    // Second dispatch should not trigger handlers
    pool.dispatch("eventA", "another message");
    pool.dispatch("eventB", 456);

    expect(handlerA).toHaveBeenCalledTimes(1);
    expect(handlerB).toHaveBeenCalledTimes(1);
  });

  it("should support extending DispatcherPool with additional methods", () => {
    const dispatcherMap = {
      event: new EventDispatcher<string>(),
    } as const;

    class CustomDispatcherPool extends DispatcherPool<typeof dispatcherMap> {
      constructor() {
        super(dispatcherMap);
      }

      customMethod() {
        return "custom method called";
      }
    }

    const customPool = new CustomDispatcherPool();
    expect(customPool.customMethod()).toBe("custom method called");

    const handler = mock((value: string) => {});
    customPool.on("event", handler);
    customPool.dispatch("event", "test");
    expect(handler).toHaveBeenCalledWith("test");
  });
});
