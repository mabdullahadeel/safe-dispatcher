import { describe, it, expect, mock } from "bun:test";
import { EventDispatcherBase, EventHandler } from "./EventDispatcherBase";

// Create a concrete implementation for testing
class TestEventDispatcher<T> extends EventDispatcherBase<T> {
  public triggerNotify(value: T) {
    this.notifySubscribers(value);
  }
}

describe("EventDispatcherBase", () => {
  it("should allow subscribing and notifying subscribers", () => {
    const dispatcher = new TestEventDispatcher<string>();
    const handler = mock((value: string) => {});

    dispatcher.subscribe(handler);
    dispatcher.triggerNotify("test message");

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith("test message");
  });

  it("should allow unsubscribing handlers", () => {
    const dispatcher = new TestEventDispatcher<number>();
    const handler = mock((value: number) => {});

    dispatcher.subscribe(handler);
    dispatcher.triggerNotify(42);
    expect(handler).toHaveBeenCalledTimes(1);

    dispatcher.unsubscribe(handler);
    dispatcher.triggerNotify(100);
    expect(handler).toHaveBeenCalledTimes(1); // Still only called once
  });

  it("should return an unsubscribe function when subscribing", () => {
    const dispatcher = new TestEventDispatcher<string>();
    const handler = mock((value: string) => {});

    const unsubscribe = dispatcher.subscribe(handler);
    dispatcher.triggerNotify("first call");
    expect(handler).toHaveBeenCalledTimes(1);

    unsubscribe();
    dispatcher.triggerNotify("second call");
    expect(handler).toHaveBeenCalledTimes(1); // Still only called once
  });

  it("should clear all subscribers when clear is called", () => {
    const dispatcher = new TestEventDispatcher<string>();
    const handler1 = mock((value: string) => {});
    const handler2 = mock((value: string) => {});

    dispatcher.subscribe(handler1);
    dispatcher.subscribe(handler2);

    dispatcher.triggerNotify("first message");
    expect(handler1).toHaveBeenCalledTimes(1);
    expect(handler2).toHaveBeenCalledTimes(1);

    dispatcher.clear();

    dispatcher.triggerNotify("second message");
    expect(handler1).toHaveBeenCalledTimes(1); // Still only called once
    expect(handler2).toHaveBeenCalledTimes(1); // Still only called once
  });

  it("should work with complex types", () => {
    interface ComplexType {
      id: string;
      data: {
        value: number;
        active: boolean;
      };
    }

    const dispatcher = new TestEventDispatcher<ComplexType>();
    const handler = mock((value: ComplexType) => {});

    dispatcher.subscribe(handler);

    const testData: ComplexType = {
      id: "test-id",
      data: {
        value: 123,
        active: true,
      },
    };

    dispatcher.triggerNotify(testData);

    expect(handler).toHaveBeenCalledWith(testData);
  });
});
