import { describe, it, expect, mock } from "bun:test";
import { EventDispatcher } from "./EventDispatcher";

describe("EventDispatcher", () => {
  it("should dispatch events to subscribers", () => {
    const dispatcher = new EventDispatcher<string>();
    const handler = mock((value: string) => {});

    dispatcher.subscribe(handler);
    dispatcher.dispatch("test message");

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith("test message");
  });

  it("should allow multiple subscribers", () => {
    const dispatcher = new EventDispatcher<number>();
    const handler1 = mock((value: number) => {});
    const handler2 = mock((value: number) => {});
    const handler3 = mock((value: number) => {});

    dispatcher.subscribe(handler1);
    dispatcher.subscribe(handler2);
    dispatcher.subscribe(handler3);

    dispatcher.dispatch(42);

    expect(handler1).toHaveBeenCalledWith(42);
    expect(handler2).toHaveBeenCalledWith(42);
    expect(handler3).toHaveBeenCalledWith(42);
  });

  it("should not call unsubscribed handlers", () => {
    const dispatcher = new EventDispatcher<string>();
    const handler1 = mock((value: string) => {});
    const handler2 = mock((value: string) => {});

    dispatcher.subscribe(handler1);
    const unsubscribe = dispatcher.subscribe(handler2);

    dispatcher.dispatch("first message");
    expect(handler1).toHaveBeenCalledTimes(1);
    expect(handler2).toHaveBeenCalledTimes(1);

    unsubscribe();

    dispatcher.dispatch("second message");
    expect(handler1).toHaveBeenCalledTimes(2);
    expect(handler2).toHaveBeenCalledTimes(1); // Still only called once
  });

  it("should work with different value types", () => {
    // String dispatcher
    const stringDispatcher = new EventDispatcher<string>();
    const stringHandler = mock((value: string) => {});
    stringDispatcher.subscribe(stringHandler);
    stringDispatcher.dispatch("string value");
    expect(stringHandler).toHaveBeenCalledWith("string value");

    // Number dispatcher
    const numberDispatcher = new EventDispatcher<number>();
    const numberHandler = mock((value: number) => {});
    numberDispatcher.subscribe(numberHandler);
    numberDispatcher.dispatch(42);
    expect(numberHandler).toHaveBeenCalledWith(42);

    // Object dispatcher
    type User = { id: string; name: string };
    const objectDispatcher = new EventDispatcher<User>();
    const objectHandler = mock((value: User) => {});
    objectDispatcher.subscribe(objectHandler);
    const user = { id: "1", name: "Test User" };
    objectDispatcher.dispatch(user);
    expect(objectHandler).toHaveBeenCalledWith(user);
  });

  it("should clear all subscribers when clear is called", () => {
    const dispatcher = new EventDispatcher<string>();
    const handler1 = mock((value: string) => {});
    const handler2 = mock((value: string) => {});

    dispatcher.subscribe(handler1);
    dispatcher.subscribe(handler2);

    dispatcher.dispatch("first message");
    expect(handler1).toHaveBeenCalledTimes(1);
    expect(handler2).toHaveBeenCalledTimes(1);

    dispatcher.clear();

    dispatcher.dispatch("second message");
    expect(handler1).toHaveBeenCalledTimes(1); // Still only called once
    expect(handler2).toHaveBeenCalledTimes(1); // Still only called once
  });

  it("should allow resubscribing after unsubscribing", () => {
    const dispatcher = new EventDispatcher<string>();
    const handler = mock((value: string) => {});

    dispatcher.subscribe(handler);
    dispatcher.dispatch("first message");
    expect(handler).toHaveBeenCalledTimes(1);

    dispatcher.unsubscribe(handler);
    dispatcher.dispatch("second message");
    expect(handler).toHaveBeenCalledTimes(1); // Still only called once

    dispatcher.subscribe(handler);
    dispatcher.dispatch("third message");
    expect(handler).toHaveBeenCalledTimes(2); // Now called twice
  });
});
